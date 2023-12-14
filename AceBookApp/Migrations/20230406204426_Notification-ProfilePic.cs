using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AceBookApp.Migrations
{
    public partial class NotificationProfilePic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotifiedByProfileImg",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotifiedByProfileImg",
                table: "Notifications");
        }
    }
}
