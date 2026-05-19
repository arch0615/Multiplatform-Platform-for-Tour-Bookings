namespace BajaTours.Api.Services.Files;

public record StoredFile(string Url, long Size, string ContentType);

public interface IFileStorage
{
    Task<StoredFile> SaveImageAsync(Stream content, string originalFileName, string contentType, long size, CancellationToken ct);
}
