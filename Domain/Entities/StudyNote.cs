namespace domain.Entities;
public class StudyNote
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Guid UserId { get; set; }
    public string Description { get; set; }

    public string PdfLink { get; set; }
    
    public ICollection<UserFavorite> FavoritedBy { get; set; } = new List<UserFavorite>();
    public User Creator { get; set; }

    public StudyNote(string name, Guid userId, string description, string pdfLink)
    {
        Id = Guid.NewGuid();
        Name = name;
        UserId = userId;
        Description = description;
        PdfLink = pdfLink;
    }
}