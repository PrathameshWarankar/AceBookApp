using AceBookApp.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace AceBookApp.Handler
{
    public class AppDbContext: DbContext
    {
        private readonly IConfiguration _config;
        private readonly AzureSqlTokenProvider _tokenProvider;

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration config, AzureSqlTokenProvider tokenProvider) : base(options)
        {
            _config = config;
            _tokenProvider = tokenProvider;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _config.GetConnectionString("AzureAdConnection");
            var connection = new SqlConnection(connectionString)
            {
                AccessToken = _tokenProvider.GetToken()
            };

            optionsBuilder.UseSqlServer(connection);
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
