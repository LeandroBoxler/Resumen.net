using domain.Types;
using System.IO;

public interface IFileService
{
    Task<OperationResult<string>> GetPresignedUrl(string fileName, string contentType);
}