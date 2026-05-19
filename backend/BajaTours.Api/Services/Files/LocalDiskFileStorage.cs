using BajaTours.Api.Configuration;
using Microsoft.Extensions.Options;

namespace BajaTours.Api.Services.Files;

public class LocalDiskFileStorage : IFileStorage
{
    private readonly StorageOptions _options;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LocalDiskFileStorage> _logger;

    public LocalDiskFileStorage(IOptions<StorageOptions> options, IWebHostEnvironment env, ILogger<LocalDiskFileStorage> logger)
    {
        _options = options.Value;
        _env = env;
        _logger = logger;
    }

    public async Task<StoredFile> SaveImageAsync(Stream content, string originalFileName, string contentType, long size, CancellationToken ct)
    {
        var dir = ResolveDirectory();
        Directory.CreateDirectory(dir);

        var extension = SanitizeExtension(Path.GetExtension(originalFileName));
        if (string.IsNullOrEmpty(extension))
            extension = ExtensionFromContentType(contentType);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(dir, fileName);

        await using (var fileStream = new FileStream(fullPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, useAsync: true))
        {
            await content.CopyToAsync(fileStream, ct);
        }

        var url = $"{_options.PublicUrlPath.TrimEnd('/')}/{fileName}";
        _logger.LogInformation("Stored upload {File} ({Bytes} bytes, {Type})", fileName, size, contentType);
        return new StoredFile(url, size, contentType);
    }

    private string ResolveDirectory()
    {
        if (Path.IsPathRooted(_options.LocalPath))
            return _options.LocalPath;
        var root = string.IsNullOrEmpty(_env.WebRootPath)
            ? Path.Combine(_env.ContentRootPath, "wwwroot")
            : _env.ContentRootPath;
        // If LocalPath starts with "wwwroot/", anchor to content root; otherwise relative to web root
        return Path.Combine(_env.ContentRootPath, _options.LocalPath);
    }

    private static string SanitizeExtension(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return "";
        var lower = raw.ToLowerInvariant();
        return lower switch
        {
            ".jpg" or ".jpeg" => ".jpg",
            ".png" => ".png",
            ".webp" => ".webp",
            _ => "",
        };
    }

    private static string ExtensionFromContentType(string contentType) => contentType switch
    {
        "image/jpeg" => ".jpg",
        "image/png" => ".png",
        "image/webp" => ".webp",
        _ => ".bin",
    };
}
