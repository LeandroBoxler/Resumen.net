namespace domain.Entities;
public class StudyNote
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    public StudyNote(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
    }
}