using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;
public class GetUserFavoritesUseCase
{
    private readonly IService<UserFavorite> _userFavoriteService;

    public GetUserFavoritesUseCase(IService<UserFavorite> userFavoriteService)
    {
        _userFavoriteService = userFavoriteService;
    }

    public async Task<OperationResult<UserFavorite[]>> Execute(Guid userId)
    {
        try
        {
            var favorites = await _userFavoriteService.GetAll();
            if (!favorites.IsSuccess)
            {
                return new OperationResult<UserFavorite[]>(favorites.Error!);
            }

            UserFavorite[] userFavorites = favorites.Value!.Where(f => f.UserId == userId).ToArray();
            return new OperationResult<UserFavorite[]>(userFavorites);
        }
        catch (Exception ex)
        {
            return new OperationResult<UserFavorite[]>(ex);
        }
    }
}
