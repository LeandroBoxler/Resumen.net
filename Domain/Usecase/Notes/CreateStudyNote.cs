using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class CreateStudyNote
{
    private readonly IService<StudyNote> _service;

    public CreateStudyNote(IService<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult> Execute(StudyNote studyNote, Guid userId)
    {
        return await _service.Create(studyNote);
    }
}