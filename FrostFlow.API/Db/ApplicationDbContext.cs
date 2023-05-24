using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReactMessagingV1.Api.Model;
using TestReactAuth.Api.Model;

namespace TestReactAuth.Api.Db
{
    public class ApplicationDbContext : IdentityDbContext<UserModel>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<ChatSessionUser> ChatSessionUsers { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Define primary keys
            builder.Entity<ChatSession>()
                .HasKey(cs => cs.SessionId);
            builder.Entity<Message>()
                .HasKey(m => m.MessageId);
            builder.Entity<ChatSessionUser>()
                .HasKey(csu => new { csu.SessionId, csu.UserId });

            // Define relationships
            builder.Entity<ChatSessionUser>()
                .HasOne(csu => csu.ChatSession)
                .WithMany(cs => cs.ChatSessionUsers)
                .HasForeignKey(csu => csu.SessionId);

            builder.Entity<ChatSessionUser>()
                .HasOne(csu => csu.User)
                .WithMany()
                .HasForeignKey(csu => csu.UserId);

            builder.Entity<Message>()
                .HasOne(m => m.ChatSession)
                .WithMany(cs => cs.Messages)
                .HasForeignKey(m => m.SessionId);

            builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId);
        }

    }
}
