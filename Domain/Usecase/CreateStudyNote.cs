using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class CreateStudyNote
{
    private readonly StudyNotesServices<StudyNote> _service;

    public CreateStudyNote(StudyNotesServices<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult> Execute(StudyNote studyNote)
    {
        return await _service.Create(studyNote);
    }
}