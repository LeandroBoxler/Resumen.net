
using domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;
public class AppDbContext : DbContext
{
    public DbSet<StudyNote> StudyNotes { get; set; }
    public DbSet<User> Users { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<StudyNote>(eb =>
        {
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Name).IsRequired();
        });

        modelBuilder.Entity<User>(eb =>
        {
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Email).IsRequired();
            eb.Property(e => e.FirstName).IsRequired();
            eb.Property(e => e.LastName).IsRequired();
            eb.Property(e => e.HashedPassword).IsRequired();
        });
    }
}