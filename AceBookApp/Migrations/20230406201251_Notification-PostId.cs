using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AceBookApp.Migrations
{
    public partial class NotificationPostId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "notifiedTo",
                table: "Notifications",
                newName: "NotifiedTo");

            migrationBuilder.RenameColumn(
                name: "notifiedBy",
                table: "Notifications",
                newName: "NotifiedBy");

            migrationBuilder.RenameColumn(
                name: "notiType",
                table: "Notifications",
                newName: "NotiType");

            migrationBuilder.RenameColumn(
                name: "notificationId",
                table: "Notifications",
                newName: "NotificationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NotifiedTo",
                table: "Notifications",
                newName: "notifiedTo");

            migrationBuilder.RenameColumn(
                name: "NotifiedBy",
                table: "Notifications",
                newName: "notifiedBy");

            migrationBuilder.RenameColumn(
                name: "NotiType",
                table: "Notifications",
                newName: "notiType");

            migrationBuilder.RenameColumn(
                name: "NotificationId",
                table: "Notifications",
                newName: "notificationId");
        }
    }
}
