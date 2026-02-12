using Microsoft.AspNetCore.Mvc;
using domain.Entities;
using domain.services;
using domain.UseCase;
using System.Threading.Tasks;
using domain.Types;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Api.Controllers;

[ApiController]
[Route("api/notes")]
public class StudyNotesController : ControllerBase
{
    private readonly StudyNotesServices<StudyNote> _service;
    
    public StudyNotesController(StudyNotesServices<StudyNote> service)
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOneStudyNote(Guid id)
    {

    GetStudyNote useCase = new GetStudyNote(_service);
    OperationResult<StudyNote> result = await useCase.Execute(id);
    if (!result.IsSuccess)
    {
        return NotFound(result.Error);
    }
    return Ok( result.Value );
    }

    [HttpPost]
    public async Task<IActionResult> CreateStudyNote([FromBody] StudyNote studyNote)
    {
        CreateStudyNote useCase = new CreateStudyNote(_service);
        OperationResult result = await useCase.Execute(studyNote);
        if (!result.IsSuccess) return BadRequest(result.Error);
        
        return Ok();
    }
     [HttpDelete("{id}")]
    public IActionResult DeleteStudyNote(Guid id)
    {
        DeleteStudyNote useCase = new DeleteStudyNote(_service);
        OperationResult result = useCase.Execute(id).Result;
        if (!result.IsSuccess) return BadRequest(result.Error);
        
        return Ok();
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudyNote(Guid id, [FromBody] StudyNote studyNote)
    {
        UpdateStudyNote useCase = new UpdateStudyNote(_service);
        OperationResult<StudyNote> result = await useCase.Execute(studyNote);
        if (!result.IsSuccess) return BadRequest( result.Error );
        
            
        
        return Ok(result.Value);
    }
}
