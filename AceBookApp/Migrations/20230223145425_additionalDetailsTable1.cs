using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AceBookApp.Migrations
{
    public partial class additionalDetailsTable1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "additionAccountDetails",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkInfo1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkInfo2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkInfo3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CollegeInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SchoolInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlaceInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SocialAccInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyMemberInfo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_additionAccountDetails", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "additionAccountDetails");
        }
    }
}
