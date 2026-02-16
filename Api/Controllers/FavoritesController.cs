using Microsoft.AspNetCore.Mvc;
using domain.Entities;
using domain.services;
using domain.UseCase;
using System.Threading.Tasks;
using domain.Types;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers;

[ApiController]
[Route("api/user/favorites")]
public class FavoritesController : ControllerBase
{
    private readonly IService<StudyNote> _noteService;
    private readonly IService<User> _userService;
    private readonly IService<UserFavorite> _favoriteService;
    
    public FavoritesController(
        IService<StudyNote> noteService,
        IService<User> userService,
        IService<UserFavorite> favoriteService)
    {
        _noteService = noteService;
        _userService = userService;
        _favoriteService = favoriteService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserFavorites()
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});

        GetUserFavoritesUseCase useCase = new GetUserFavoritesUseCase(_favoriteService);
        OperationResult<UserFavorite[]> result = await useCase.Execute(userId);
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Error?.Message ?? "Error retrieving favorites" });
        }
        
        return Ok(result.Value);
    }

    [HttpPost("{noteId}")]
    [Authorize]
    public async Task<IActionResult> AddFavorite(Guid noteId)
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});

        AddFavoriteUseCase useCase = new AddFavoriteUseCase(_noteService, _userService, _favoriteService);
        OperationResult result = await useCase.Execute(userId, noteId);
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Error?.Message ?? "Error adding favorite" });
        }
        
        return Ok();
    }

    [HttpDelete("{noteId}")]
    [Authorize]
    public async Task<IActionResult> RemoveFavorite(Guid noteId)
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});

        RemoveFavoriteUseCase useCase = new RemoveFavoriteUseCase(_favoriteService);
        OperationResult result = await useCase.Execute(noteId, userId);
        
        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Error?.Message ?? "Error removing favorite" });
        }
        
        return Ok();
    } 
}
