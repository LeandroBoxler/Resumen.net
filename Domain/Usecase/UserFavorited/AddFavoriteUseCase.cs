using domain.Entities;
using domain.services;
using domain.Types;


namespace domain.UseCase;
public class AddFavoriteUseCase
{
    private readonly IService<StudyNote> _noteService;
    private readonly IService<User> _userService;
    private readonly IService<UserFavorite> _userFavoriteService;

    public AddFavoriteUseCase(IService<StudyNote> noteService, IService<User> userService, IService<UserFavorite> userFavoriteService)
    {
        _noteService = noteService;
        _userService = userService;
        _userFavoriteService = userFavoriteService;
    }

    public async Task<OperationResult> Execute(Guid userId, Guid noteId)
    {
        OperationResult<StudyNote> note = await _noteService.GetById(noteId);

                if (!note.IsSuccess)
        {
            return new OperationResult(new Exception("Note not found"));
        }

        OperationResult<User> user = await _userService.GetById(userId);

        if (!user.IsSuccess)
        {
            return new OperationResult(new Exception("User not found"));
        }

        var userFavorite = new UserFavorite
        (
            userId,
            noteId
        );
       

        return await _userFavoriteService.Create(userFavorite);
    }
}