using Microsoft.AspNetCore.Mvc;
using domain.Entities;
using domain.services;
using domain.UseCase;
using System.Threading.Tasks;
using domain.Types;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Api.Controllers;

[ApiController]
[Route("api/presigned")]
public class PresignedUrlController : ControllerBase
{
    public class PresignedUrlDTO
    {
        [Required]
        public required string FileName { get; set; }
        [Required]
        public required string ContentType { get; set; }
    }

    private readonly IFileService _service;
    
    public PresignedUrlController(IFileService fileService)
    {
        _service = fileService;

    }
    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> GetPresignedUrl([FromBody] PresignedUrlDTO body)
    {
        GetPresignedUrlUseCase useCase = new GetPresignedUrlUseCase(_service);
        OperationResult<string> result = await useCase.Execute(body.FileName, body.ContentType);
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Error?.Message ?? "Error generating presigned URL" });
        }
        
        return Ok(new { url = result.Value });
    }

   
}
