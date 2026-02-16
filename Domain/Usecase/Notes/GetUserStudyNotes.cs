using domain.services;
using domain.Entities;
using domain.Types;

public class GetUserStudyNotes
{
    private readonly IService<StudyNote> _service;

    public GetUserStudyNotes(IService<StudyNote> service)
    {
        _service = service;
    }

    public async Task<OperationResult<StudyNote[]>> Execute(Guid userId)
    {
        var query = new Query<StudyNote>
        {
            Filters = new BaseFilter<StudyNote>
            {
                Field = nameof(StudyNote.UserId),
                Operator = FilterOperator.Eq,
                Value = userId
            }
        };
        return await _service.GetMany(query);
    }
}
