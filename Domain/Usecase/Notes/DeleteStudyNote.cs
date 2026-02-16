using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class DeleteStudyNote
{
    private readonly IService<StudyNote> _service;

    public DeleteStudyNote(IService<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult> Execute(Guid id, Guid userId)
    {
        if (id == Guid.Empty)
        {
            return new OperationResult(new ArgumentException("Id cannot be empty."));
        }

        OperationResult<StudyNote> existingNoteResult = await _service.GetById(id);
        if (!existingNoteResult.IsSuccess)
        {
            return new OperationResult(new Exception("StudyNote not found"));
        }

        if (existingNoteResult.Value!.UserId != userId)
        {
            return new OperationResult(new UnauthorizedAccessException("User does not have permission to delete this note."));
        }

        return await _service.Delete(id);        
    }
    
}