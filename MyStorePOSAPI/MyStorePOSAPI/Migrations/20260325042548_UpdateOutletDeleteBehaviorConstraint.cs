using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyStorePOSAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOutletDeleteBehaviorConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuRoles_AspNetRoles_RoleId",
                table: "MenuRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuRoles_Menus_MenuId",
                table: "MenuRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlets_AspNetUsers_UserId",
                table: "UserOutlets");

            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlets_Outlets_OutletId",
                table: "UserOutlets");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuRoles_AspNetRoles_RoleId",
                table: "MenuRoles",
                column: "RoleId",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuRoles_Menus_MenuId",
                table: "MenuRoles",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserOutlets_AspNetUsers_UserId",
                table: "UserOutlets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserOutlets_Outlets_OutletId",
                table: "UserOutlets",
                column: "OutletId",
                principalTable: "Outlets",
                principalColumn: "OutletId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuRoles_AspNetRoles_RoleId",
                table: "MenuRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuRoles_Menus_MenuId",
                table: "MenuRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlets_AspNetUsers_UserId",
                table: "UserOutlets");

            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlets_Outlets_OutletId",
                table: "UserOutlets");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuRoles_AspNetRoles_RoleId",
                table: "MenuRoles",
                column: "RoleId",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuRoles_Menus_MenuId",
                table: "MenuRoles",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
    }
}
