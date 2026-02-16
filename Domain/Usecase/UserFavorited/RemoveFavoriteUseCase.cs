using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class RemoveFavoriteUseCase
{
    private readonly IService<UserFavorite> _service;

    public RemoveFavoriteUseCase(IService<UserFavorite> service)
    {
        _service = service;
    }

    public async Task<OperationResult> Execute(Guid noteId, Guid userId)
    {
        if (noteId == Guid.Empty)
        {
            return new OperationResult(new ArgumentException("Id cannot be empty."));
        }

        OperationResult<UserFavorite> existingFavoriteResult = await _service.GetOne(new Query<UserFavorite>
        {
            Filters = new AndFilter<UserFavorite>
            {
                
                Value = new List<IFilter<UserFavorite>> {
                    new BaseFilter<UserFavorite>
            {
                Field = nameof(UserFavorite.NoteId),
                Value = noteId
            },new BaseFilter<UserFavorite>
            {
                Field = nameof(UserFavorite.UserId),
                Value = userId
            }
                }
            }
        });
        if (!existingFavoriteResult.IsSuccess)
        {
            return new OperationResult(new Exception("UserFavorite not found"));
        }

        if (existingFavoriteResult.Value!.UserId != userId)
        {
            return new OperationResult(new UnauthorizedAccessException("User does not have permission to delete this favorite."));
        }

        return await _service.Delete(existingFavoriteResult.Value!.Id);        
    }
    
}