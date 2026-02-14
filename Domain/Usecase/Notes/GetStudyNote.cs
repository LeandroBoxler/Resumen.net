using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class GetStudyNote
{
    private readonly IService<StudyNote> _service;

    public GetStudyNote(IService<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult<StudyNote>> Execute(Guid id)
    {
        if (id == Guid.Empty)
        {
            return new OperationResult<StudyNote>(new ArgumentException("Id cannot be empty."));
        }

        OperationResult<StudyNote> existingNoteResult = await _service.GetById(id);
        if (!existingNoteResult.IsSuccess)
        {
            return new OperationResult<StudyNote>(new Exception("StudyNote not found"));
        }

        return existingNoteResult;
    }
    
}