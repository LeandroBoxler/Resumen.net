using domain.services;
using domain.Entities;
using domain.Types;

public class GetStudyNotes
{
    private readonly StudyNotesServices<StudyNote> _service;

    public GetStudyNotes(StudyNotesServices<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult<StudyNote[]>> Execute()
    {
        return await _service.GetAll();
    }
}
