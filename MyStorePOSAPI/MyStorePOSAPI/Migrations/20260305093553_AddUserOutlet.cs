using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyStorePOSAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUserOutlet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OutletId",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "UserOutlet",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    OutletId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserOutlet", x => new { x.UserId, x.OutletId });
                    table.ForeignKey(
                        name: "FK_UserOutlet_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserOutlet_Outlets_OutletId",
                        column: x => x.OutletId,
                        principalTable: "Outlets",
                        principalColumn: "OutletId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserOutlet_OutletId",
                table: "UserOutlet",
                column: "OutletId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserOutlet");

            migrationBuilder.AddColumn<string>(
                name: "OutletId",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
