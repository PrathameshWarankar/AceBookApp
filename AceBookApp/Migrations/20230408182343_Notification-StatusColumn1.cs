using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AceBookApp.Migrations
{
    public partial class NotificationStatusColumn1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PostStatus",
                table: "Notifications",
                newName: "NotiStatus");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NotiStatus",
                table: "Notifications",
                newName: "PostStatus");
        }
    }
}
