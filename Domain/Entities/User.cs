using domain.services;

namespace domain.Entities;

public class SecureUser : Entity
{    
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public ICollection<UserFavorite> Favorites { get; set; } = new List<UserFavorite>();
    public ICollection<StudyNote> CreatedNotes { get; set; } = new List<StudyNote>();

    public SecureUser(string firstName, string lastName, string email)
    {
        Id = Guid.NewGuid();
        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }
}

public class User : SecureUser
{
    public string HashedPassword { get; set; }

    public User(string firstName, string lastName, string email, string hashedPassword) : 
    base(firstName, lastName, email)
    {
        HashedPassword = hashedPassword;
    }

    
    public static SecureUser ToSecureUser(User user)
    {
        return new SecureUser(user.FirstName, user.LastName, user.Email) 
        {
            Id = user.Id,
            CreatedNotes = user.CreatedNotes,
            Favorites = user.Favorites
        };
    }
}