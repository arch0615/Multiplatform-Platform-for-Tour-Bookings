using System.Text;
using BajaTours.Api.Configuration;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Services.Admin;
using BajaTours.Api.Services.Auth;
using BajaTours.Api.Services.Availability;
using BajaTours.Api.Services.Bookings;
using BajaTours.Api.Services.Coupons;
using BajaTours.Api.Services.Favorites;
using BajaTours.Api.Services.Files;
using BajaTours.Api.Services.Notifications;
using BajaTours.Api.Services.Payments;
using BajaTours.Api.Services.ProviderTours;
using BajaTours.Api.Services.Reviews;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Structured logging: console (human-readable in dev, JSON in prod) + rolling file.
builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("service", "baja-tours-api")
        .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
        .WriteTo.Console()
        .WriteTo.File(
            path: Path.Combine(context.HostingEnvironment.ContentRootPath, "logs", "baja-tours-.log"),
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 14,
            shared: true,
            outputTemplate: "{Timestamp:yyyy-MM-ddTHH:mm:ss.fffZ} [{Level:u3}] {SourceContext} {Message:lj} {Properties:j}{NewLine}{Exception}");
});

const string CorsPolicy = "BajaToursFrontend";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database", tags: new[] { "ready" });

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
    ?? throw new InvalidOperationException("Jwt configuration section is missing.");

if (string.IsNullOrWhiteSpace(jwtOptions.SigningKey) || jwtOptions.SigningKey.StartsWith("__"))
    throw new InvalidOperationException("Jwt:SigningKey must be configured (use user-secrets or env vars).");

builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.Configure<PaymentsOptions>(builder.Configuration.GetSection(PaymentsOptions.SectionName));
var paymentsMode = builder.Configuration.GetSection(PaymentsOptions.SectionName)["Mode"] ?? "Mock";
if (paymentsMode.Equals("Mock", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddScoped<IMercadoPagoService, MockMercadoPagoService>();
}
else
{
    builder.Services.AddHttpClient(MercadoPagoService.HttpClientName);
    builder.Services.AddScoped<IMercadoPagoService, MercadoPagoService>();
}
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IProviderToursService, ProviderToursService>();
builder.Services.AddScoped<IProviderReportsService, ProviderReportsService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IReviewsService, ReviewsService>();
builder.Services.AddScoped<ICouponsService, CouponsService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<IFavoritesService, FavoritesService>();
builder.Services.AddHostedService<BookingCompletionService>();

builder.Services.Configure<StorageOptions>(builder.Configuration.GetSection(StorageOptions.SectionName));
builder.Services.AddScoped<IFileStorage, LocalDiskFileStorage>();

builder.Services.Configure<NotificationsOptions>(builder.Configuration.GetSection(NotificationsOptions.SectionName));
var emailProvider = builder.Configuration.GetSection(NotificationsOptions.SectionName)["Email:Provider"] ?? "Noop";
if (emailProvider.Equals("Smtp", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
}
else
{
    builder.Services.AddScoped<IEmailService, NoopEmailService>();
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ClientOnly", p => p.RequireRole("Client"));
    options.AddPolicy("ProviderOnly", p => p.RequireRole("Provider"));
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
});

builder.Services.AddCors(options =>
{
    var allowed = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?? new[] { "http://localhost:5173" };

    options.AddPolicy(CorsPolicy, policy => policy
        .WithOrigins(allowed)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// Rate limiting. Buckets sized at the protective floor — generous enough not to
// hurt real users, tight enough to stop credential-stuffing and abuse loops.
// Auth: by IP. Bookings: by authenticated user id (falls back to IP if anonymous).
builder.Services.AddRateLimiter(rl =>
{
    rl.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    rl.AddPolicy("auth", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true,
            }));

    rl.AddPolicy("auth-strict", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true,
            }));

    rl.AddPolicy("bookings", httpContext =>
    {
        var sub = httpContext.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                 ?? httpContext.Connection.RemoteIpAddress?.ToString()
                 ?? "anonymous";
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: sub,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true,
            });
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Baja Tours API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(CorsPolicy);

// Serve uploaded files at /uploads/<filename>
var storageSection = app.Configuration.GetSection(StorageOptions.SectionName).Get<StorageOptions>() ?? new StorageOptions();
var uploadsDir = Path.IsPathRooted(storageSection.LocalPath)
    ? storageSection.LocalPath
    : Path.Combine(builder.Environment.ContentRootPath, storageSection.LocalPath);
Directory.CreateDirectory(uploadsDir);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsDir),
    RequestPath = storageSection.PublicUrlPath,
});

// Request logging: one line per HTTP request with method, path, status, elapsed.
// Skip the noisy health endpoint — it's polled by load balancers.
app.UseSerilogRequestLogging(opts =>
{
    opts.GetLevel = (httpContext, _, ex) =>
    {
        if (ex != null) return LogEventLevel.Error;
        if (httpContext.Request.Path.StartsWithSegments("/health")) return LogEventLevel.Debug;
        return httpContext.Response.StatusCode >= 500 ? LogEventLevel.Error
             : httpContext.Response.StatusCode >= 400 ? LogEventLevel.Warning
             : LogEventLevel.Information;
    };
    opts.EnrichDiagnosticContext = (diag, httpContext) =>
    {
        diag.Set("user_id", httpContext.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "anon");
        diag.Set("ip", httpContext.Connection.RemoteIpAddress?.ToString() ?? "");
    };
});

app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.UseMiddleware<BajaTours.Api.Middleware.AdminAuditMiddleware>();
app.MapControllers();

// Liveness: the process is up. Cheap, always-200 unless the process is dead.
app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "baja-tours-api" }));

// Readiness: dependencies are reachable. Used by load balancers / k8s to know
// when to route traffic. Currently checks the SQL Server connection.
app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = async (ctx, report) =>
    {
        ctx.Response.ContentType = "application/json";
        var payload = new
        {
            status = report.Status.ToString().ToLowerInvariant(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString().ToLowerInvariant(),
                duration_ms = (int)e.Value.Duration.TotalMilliseconds,
                description = e.Value.Description,
            }),
            duration_ms = (int)report.TotalDuration.TotalMilliseconds,
        };
        await System.Text.Json.JsonSerializer.SerializeAsync(ctx.Response.Body, payload);
    },
});

app.Run();
