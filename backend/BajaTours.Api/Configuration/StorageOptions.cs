namespace BajaTours.Api.Configuration;

public class StorageOptions
{
    public const string SectionName = "Storage";

    /// <summary>"LocalDisk" (default) or future "AzureBlob"/"S3".</summary>
    public string Provider { get; set; } = "LocalDisk";

    /// <summary>Filesystem directory under which uploads land. Created if missing.</summary>
    public string LocalPath { get; set; } = "wwwroot/uploads";

    /// <summary>URL prefix for uploaded files. Defaults to "/uploads".</summary>
    public string PublicUrlPath { get; set; } = "/uploads";

    /// <summary>Comma-separated allowed image content types.</summary>
    public string AllowedImageContentTypes { get; set; } = "image/jpeg,image/png,image/webp";

    public long MaxImageBytes { get; set; } = 5 * 1024 * 1024;
}
