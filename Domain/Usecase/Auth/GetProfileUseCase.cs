using domain.services;
using domain.Entities;
using domain.Types;

namespace domain.UseCase;
public class GetProfileUseCase
{
    private readonly IService<User> _service;
    private readonly IService<UserFavorite> _favoriteService;
    private readonly IService<StudyNote> _noteService;

    public GetProfileUseCase(IService<User> service, IService<UserFavorite> favoriteService, IService<StudyNote> noteService)
    {
        _service = service;
        _favoriteService = favoriteService;
        _noteService = noteService;
    }

    public async Task<OperationResult<SecureUser>> Execute(Guid userId)
    {
        OperationResult<User> result = await _service.GetById(userId);

        if (!result.IsSuccess)
        {
            return new OperationResult<SecureUser>(result.Error!);
        }

        OperationResult<UserFavorite[]> favorites = await _favoriteService.GetMany(new Query<UserFavorite>
        {
            Filters = new BaseFilter<UserFavorite>
            {
                Field = nameof(UserFavorite.UserId),
                Operator = FilterOperator.Eq,
                Value = userId
            }
        });

        OperationResult<StudyNote[]> createdNotes = await _noteService.GetMany(new Query<StudyNote>
        {
            Filters = new BaseFilter<StudyNote>
            {
                Field = nameof(StudyNote.UserId),
                Operator = FilterOperator.Eq,
                Value = userId
            }
        });

        var secureUser = User.ToSecureUser(result.Value!);
        
        if (favorites.IsSuccess && favorites.Value != null)
        {
            secureUser.Favorites = favorites.Value.ToList();
        }
        
        if (createdNotes.IsSuccess && createdNotes.Value != null)
        {
            secureUser.CreatedNotes = createdNotes.Value.ToList();
        }
        
        return new OperationResult<SecureUser>(secureUser);
    }
}
