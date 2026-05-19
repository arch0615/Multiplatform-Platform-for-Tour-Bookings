using BajaTours.Api.Configuration;
using BajaTours.Api.Services.Files;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/files")]
public class FilesController : ControllerBase
{
    private readonly IFileStorage _storage;
    private readonly StorageOptions _options;
    private readonly ILogger<FilesController> _logger;

    public FilesController(IFileStorage storage, IOptions<StorageOptions> options, ILogger<FilesController> logger)
    {
        _storage = storage;
        _options = options.Value;
        _logger = logger;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<StoredFile>> Upload(IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file received." });

        if (file.Length > _options.MaxImageBytes)
            return StatusCode(StatusCodes.Status413PayloadTooLarge,
                new { error = $"Image exceeds {_options.MaxImageBytes / (1024 * 1024)} MB limit." });

        var allowed = _options.AllowedImageContentTypes
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => s.ToLowerInvariant())
            .ToHashSet();

        var ct1 = (file.ContentType ?? "").ToLowerInvariant();
        if (!allowed.Contains(ct1))
            return StatusCode(StatusCodes.Status415UnsupportedMediaType,
                new { error = $"Allowed types: {_options.AllowedImageContentTypes}." });

        // Read the first few bytes to sniff magic numbers — defends against a client lying about content-type
        await using var stream = file.OpenReadStream();
        var head = new byte[12];
        var read = await stream.ReadAsync(head.AsMemory(0, head.Length), ct);
        if (read < 4 || !IsKnownImageMagic(head, ct1))
        {
            _logger.LogWarning("Upload rejected — content-type {Type} does not match magic bytes", ct1);
            return StatusCode(StatusCodes.Status415UnsupportedMediaType,
                new { error = "File does not look like a valid image." });
        }
        stream.Position = 0;

        var stored = await _storage.SaveImageAsync(stream, file.FileName, ct1, file.Length, ct);
        return Ok(stored);
    }

    private static bool IsKnownImageMagic(byte[] head, string contentType)
    {
        // JPEG: FF D8 FF
        if (contentType == "image/jpeg")
            return head[0] == 0xFF && head[1] == 0xD8 && head[2] == 0xFF;
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (contentType == "image/png")
            return head[0] == 0x89 && head[1] == 0x50 && head[2] == 0x4E && head[3] == 0x47;
        // WebP: RIFF....WEBP
        if (contentType == "image/webp")
            return head.Length >= 12
                && head[0] == 0x52 && head[1] == 0x49 && head[2] == 0x46 && head[3] == 0x46
                && head[8] == 0x57 && head[9] == 0x45 && head[10] == 0x42 && head[11] == 0x50;
        return false;
    }
}
