using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class DeleteStudyNote
{
    private readonly StudyNotesServices<StudyNote> _service;

    public DeleteStudyNote(StudyNotesServices<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult> Execute(Guid id)
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

        return await _service.Delete(id);        
    }
    
}