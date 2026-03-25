using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyStorePOSAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveExtraUserOutletTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlet_AspNetUsers_UserId",
                table: "UserOutlet");

            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlet_Outlets_OutletId",
                table: "UserOutlet");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserOutlet",
                table: "UserOutlet");

            migrationBuilder.RenameTable(
                name: "UserOutlet",
                newName: "UserOutlets");

            migrationBuilder.RenameIndex(
                name: "IX_UserOutlet_OutletId",
                table: "UserOutlets",
                newName: "IX_UserOutlets_OutletId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserOutlets",
                table: "UserOutlets",
                columns: new[] { "UserId", "OutletId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserOutlets_AspNetUsers_UserId",
                table: "UserOutlets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserOutlets_Outlets_OutletId",
                table: "UserOutlets",
                column: "OutletId",
                principalTable: "Outlets",
                principalColumn: "OutletId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlets_AspNetUsers_UserId",
                table: "UserOutlets");

            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlets_Outlets_OutletId",
                table: "UserOutlets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserOutlets",
                table: "UserOutlets");

            migrationBuilder.RenameTable(
                name: "UserOutlets",
                newName: "UserOutlet");

            migrationBuilder.RenameIndex(
                name: "IX_UserOutlets_OutletId",
                table: "UserOutlet",
                newName: "IX_UserOutlet_OutletId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserOutlet",
                table: "UserOutlet",
                columns: new[] { "UserId", "OutletId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserOutlet_AspNetUsers_UserId",
                table: "UserOutlet",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserOutlet_Outlets_OutletId",
                table: "UserOutlet",
                column: "OutletId",
                principalTable: "Outlets",
                principalColumn: "OutletId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
