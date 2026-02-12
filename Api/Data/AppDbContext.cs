
using domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;
public class AppDbContext : DbContext
{
    public DbSet<StudyNote> StudyNotes { get; set; }

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
    }
}