using Microsoft.EntityFrameworkCore;

namespace AceBookApp.Models
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {
            
        }
        public DbSet<Account> Accounts { get; set; }

        public DbSet<Post> Posts { get; set; }

        public DbSet<FriendRequest> FriendRequests { get; set; }

        public DbSet<Like> Likes { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<AdditionAccountDetail> additionAccountDetails { get; set; }

        public DbSet<Friend> Friends { get; set; }  

        public DbSet<Notification> Notifications { get; set; }
        
    }
}
