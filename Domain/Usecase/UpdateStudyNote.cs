using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class UpdateStudyNote
{
    private readonly StudyNotesServices<StudyNote> _service;

    public UpdateStudyNote(StudyNotesServices<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult<StudyNote>> Execute(StudyNote updatedNote)
    {
        if (updatedNote == null || updatedNote.Id == Guid.Empty)
        {
            return new OperationResult<StudyNote>(new ArgumentException("Id cannot be empty."));
        }

        OperationResult<StudyNote> existingNoteResult = await _service.GetById(updatedNote.Id);
        if (!existingNoteResult.IsSuccess)
        {
            return new OperationResult<StudyNote>(new Exception("StudyNote not found"));
        }
        await _service.Update(updatedNote);
        return new OperationResult<StudyNote>(updatedNote); 
    }
    
}