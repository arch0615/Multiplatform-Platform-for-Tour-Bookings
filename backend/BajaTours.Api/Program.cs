using System.Text;
using BajaTours.Api.Configuration;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Services.Admin;
using BajaTours.Api.Services.Auth;
using BajaTours.Api.Services.Bookings;
using BajaTours.Api.Services.Files;
using BajaTours.Api.Services.Notifications;
using BajaTours.Api.Services.Payments;
using BajaTours.Api.Services.ProviderTours;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "BajaToursFrontend";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

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

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "baja-tours-api" }));

app.Run();
