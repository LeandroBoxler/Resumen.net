namespace domain.Entities;
public class StudyNote
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    // PENDIENTE: public Guid UserId { get; set; }

    public StudyNote(string name /*, Guid userId*/)
    {
        Id = Guid.NewGuid();
        Name = name;
        // UserId = userId;
    }
}