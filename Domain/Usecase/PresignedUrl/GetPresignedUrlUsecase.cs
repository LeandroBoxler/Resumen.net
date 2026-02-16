using domain.services;
using domain.Entities;
using domain.Types;

public class GetPresignedUrlUseCase
{
    private readonly IFileService _service;

    public GetPresignedUrlUseCase(IFileService service)
    {
        _service = service;
    }
    
    public async Task<OperationResult<string>> Execute(string fileName, string contentType)
    {
        return await _service.GetPresignedUrl(fileName, contentType);
    }
}
