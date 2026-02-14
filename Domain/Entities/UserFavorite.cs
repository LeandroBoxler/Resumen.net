namespace domain.Entities;
public class UserFavorite
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid NoteId { get; set; }

    public UserFavorite(Guid userId, Guid noteId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        NoteId = noteId;
    }
}