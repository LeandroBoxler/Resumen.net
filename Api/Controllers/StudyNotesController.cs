using Microsoft.AspNetCore.Mvc;
using domain.Entities;
using domain.services;
using domain.UseCase;
using System.Threading.Tasks;
using domain.Types;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
namespace Api.Controllers;

[ApiController]
[Route("api/notes")]
public class StudyNotesController : ControllerBase
{
    private readonly IService<StudyNote> _service;

    public class CreateNoteDTO
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string PdfLink { get; set; }
    }

    
    public StudyNotesController(IService<StudyNote> service)
    {
        _service = service;
    }

    
    [HttpGet]
    public IActionResult GetAllStudyNotes()
    {
        GetStudyNotes useCase = new GetStudyNotes(_service);
        OperationResult<StudyNote[]> result = useCase.Execute().Result;
        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Error?.Message ?? "Error retrieving study notes" });
        }
        return Ok(result.Value);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyStudyNotes()
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});

        GetUserStudyNotes useCase = new GetUserStudyNotes(_service);
        OperationResult<StudyNote[]> result = await useCase.Execute(userId);
        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Error?.Message ?? "Error retrieving user notes" });
        }
        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOneStudyNote(Guid id)
    {

    GetStudyNote useCase = new GetStudyNote(_service);
    OperationResult<StudyNote> result = await useCase.Execute(id);
    if (!result.IsSuccess)
    {
        return NotFound(new {message=result.Error!.Message});
    }
    return Ok( result.Value );
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateStudyNote([FromBody] CreateNoteDTO studyNote)
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});

        CreateStudyNote useCase = new CreateStudyNote(_service);
        OperationResult result = await useCase.Execute(new () {
            Name = studyNote.Name, 
            Description = studyNote.Description, 
            PdfLink = studyNote.PdfLink 
        }, userId);
        
        if (!result.IsSuccess) return BadRequest(new {message=result.Error!.Message});
        
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteStudyNote(Guid id)
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});
        DeleteStudyNote useCase = new DeleteStudyNote(_service);
        OperationResult result = useCase.Execute(id, userId).Result;
        if (!result.IsSuccess) return BadRequest(new {message=result.Error!.Message});
        
        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateStudyNote(Guid id, [FromBody] StudyNote studyNote)
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});
        UpdateStudyNote useCase = new UpdateStudyNote(_service);
        OperationResult<StudyNote> result = await useCase.Execute(studyNote, userId);
        if (!result.IsSuccess) return BadRequest( new {message=result.Error!.Message} );
        
        return Ok(result.Value);
    }
}
