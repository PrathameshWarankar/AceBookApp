using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AceBookApp.Migrations
{
    public partial class additionalDetailsTable2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_additionAccountDetails",
                table: "additionAccountDetails");

            migrationBuilder.DropColumn(
                name: "id",
                table: "additionAccountDetails");

            migrationBuilder.AddColumn<string>(
                name: "Loggedemail",
                table: "additionAccountDetails",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_additionAccountDetails",
                table: "additionAccountDetails",
                column: "Loggedemail");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_additionAccountDetails",
                table: "additionAccountDetails");

            migrationBuilder.DropColumn(
                name: "Loggedemail",
                table: "additionAccountDetails");

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "additionAccountDetails",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_additionAccountDetails",
                table: "additionAccountDetails",
                column: "id");
        }
    }
}
