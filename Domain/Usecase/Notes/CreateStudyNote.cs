using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;

public class CreateNotePayload
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string PdfLink { get; set; }
}

public class CreateStudyNote
{
    private readonly IService<StudyNote> _service;

    public CreateStudyNote(IService<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult> Execute(CreateNotePayload studyNote, Guid userId)
    {
        StudyNote newNote = new StudyNote
        (
            studyNote.Name,
            userId,
            studyNote.Description,
            studyNote.PdfLink
            
        );
        return await _service.Create(newNote);
    }
}