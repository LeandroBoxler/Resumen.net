using domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;
public class AppDbContext : DbContext
{
    public DbSet<StudyNote> StudyNotes { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserFavorite> UserFavorites { get; set; }

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
            eb.Property(e => e.UserId).IsRequired();
            eb.Property(e => e.Description).IsRequired();
            eb.Property(e => e.PdfLink).IsRequired();
            
            // Relation
            eb.HasOne(e => e.Creator)
                .WithMany(u => u.CreatedNotes)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<User>(eb =>
        {
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Email).IsRequired();
            eb.Property(e => e.FirstName).IsRequired();
            eb.Property(e => e.LastName).IsRequired();
            eb.Property(e => e.HashedPassword).IsRequired();
            eb.HasIndex(e => e.Email).IsUnique();

            // Relation
            eb.HasMany(u => u.CreatedNotes)
              .WithOne(n => n.Creator)
              .HasForeignKey(n => n.UserId)
              .OnDelete(DeleteBehavior.Cascade);
        });

      modelBuilder.Entity<UserFavorite>(eb =>
        {
            eb.HasKey(e => e.Id);
            eb.Property(e => e.UserId).IsRequired();
            eb.Property(e => e.NoteId).IsRequired();

            // Relations
            eb.HasOne(e => e.User)
              .WithMany(u => u.Favorites)
              .HasForeignKey(e => e.UserId)
              .OnDelete(DeleteBehavior.Cascade);
            eb.HasOne(e => e.StudyNote)
              .WithMany(n => n.FavoritedBy)
              .HasForeignKey(e => e.NoteId)
              .OnDelete(DeleteBehavior.Cascade);
        });
    }
}