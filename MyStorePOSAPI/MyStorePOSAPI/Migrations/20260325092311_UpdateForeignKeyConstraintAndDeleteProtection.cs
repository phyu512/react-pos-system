using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyStorePOSAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateForeignKeyConstraintAndDeleteProtection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_AspNetUsers_PortalUserId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Outlets_OutletId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Products_ProductId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentReceipts_AspNetUsers_ApprovedById",
                table: "PaymentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentReceipts_Customers_CustomerId",
                table: "PaymentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentReceipts_SaleOrders_SaleOrderId",
                table: "PaymentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleInvoiceLines_Products_ProductId",
                table: "SaleInvoiceLines");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleInvoices_Customers_CustomerId",
                table: "SaleInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleInvoices_Employees_EmployeeId",
                table: "SaleInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleOrderDetails_Products_ProductId",
                table: "SaleOrderDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleOrders_Customers_CustomerId",
                table: "SaleOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleOrders_Employees_EmployeeId",
                table: "SaleOrders");

            migrationBuilder.DropIndex(
                name: "IX_Employees_PortalUserId",
                table: "Employees");

            migrationBuilder.AddColumn<string>(
                name: "OutletId1",
                table: "UserOutlets",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MenuId1",
                table: "MenuRoles",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Employees",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_UserOutlets_OutletId1",
                table: "UserOutlets",
                column: "OutletId1");

            migrationBuilder.CreateIndex(
                name: "IX_SaleInvoices_InvoiceId",
                table: "SaleInvoices",
                column: "InvoiceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductName",
                table: "Products",
                column: "ProductName");

            migrationBuilder.CreateIndex(
                name: "IX_MenuRoles_MenuId1",
                table: "MenuRoles",
                column: "MenuId1");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_PortalUserId",
                table: "Employees",
                column: "PortalUserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_AspNetUsers_PortalUserId",
                table: "Employees",
                column: "PortalUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Outlets_OutletId",
                table: "Inventories",
                column: "OutletId",
                principalTable: "Outlets",
                principalColumn: "OutletId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Products_ProductId",
                table: "Inventories",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuRoles_Menus_MenuId1",
                table: "MenuRoles",
                column: "MenuId1",
                principalTable: "Menus",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentReceipts_AspNetUsers_ApprovedById",
                table: "PaymentReceipts",
                column: "ApprovedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentReceipts_Customers_CustomerId",
                table: "PaymentReceipts",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentReceipts_SaleOrders_SaleOrderId",
                table: "PaymentReceipts",
                column: "SaleOrderId",
                principalTable: "SaleOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleInvoiceLines_Products_ProductId",
                table: "SaleInvoiceLines",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleInvoices_Customers_CustomerId",
                table: "SaleInvoices",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleInvoices_Employees_EmployeeId",
                table: "SaleInvoices",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleOrderDetails_Products_ProductId",
                table: "SaleOrderDetails",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleOrders_Customers_CustomerId",
                table: "SaleOrders",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleOrders_Employees_EmployeeId",
                table: "SaleOrders",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserOutlets_Outlets_OutletId1",
                table: "UserOutlets",
                column: "OutletId1",
                principalTable: "Outlets",
                principalColumn: "OutletId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_AspNetUsers_PortalUserId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Outlets_OutletId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Products_ProductId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuRoles_Menus_MenuId1",
                table: "MenuRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentReceipts_AspNetUsers_ApprovedById",
                table: "PaymentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentReceipts_Customers_CustomerId",
                table: "PaymentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentReceipts_SaleOrders_SaleOrderId",
                table: "PaymentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleInvoiceLines_Products_ProductId",
                table: "SaleInvoiceLines");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleInvoices_Customers_CustomerId",
                table: "SaleInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleInvoices_Employees_EmployeeId",
                table: "SaleInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleOrderDetails_Products_ProductId",
                table: "SaleOrderDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleOrders_Customers_CustomerId",
                table: "SaleOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleOrders_Employees_EmployeeId",
                table: "SaleOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_UserOutlets_Outlets_OutletId1",
                table: "UserOutlets");

            migrationBuilder.DropIndex(
                name: "IX_UserOutlets_OutletId1",
                table: "UserOutlets");

            migrationBuilder.DropIndex(
                name: "IX_SaleInvoices_InvoiceId",
                table: "SaleInvoices");

            migrationBuilder.DropIndex(
                name: "IX_Products_ProductName",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_MenuRoles_MenuId1",
                table: "MenuRoles");

            migrationBuilder.DropIndex(
                name: "IX_Employees_PortalUserId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "OutletId1",
                table: "UserOutlets");

            migrationBuilder.DropColumn(
                name: "MenuId1",
                table: "MenuRoles");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Employees");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_PortalUserId",
                table: "Employees",
                column: "PortalUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_AspNetUsers_PortalUserId",
                table: "Employees",
                column: "PortalUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Outlets_OutletId",
                table: "Inventories",
                column: "OutletId",
                principalTable: "Outlets",
                principalColumn: "OutletId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Products_ProductId",
                table: "Inventories",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentReceipts_AspNetUsers_ApprovedById",
                table: "PaymentReceipts",
                column: "ApprovedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentReceipts_Customers_CustomerId",
                table: "PaymentReceipts",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentReceipts_SaleOrders_SaleOrderId",
                table: "PaymentReceipts",
                column: "SaleOrderId",
                principalTable: "SaleOrders",
                principalColumn: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleInvoiceLines_Products_ProductId",
                table: "SaleInvoiceLines",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleInvoices_Customers_CustomerId",
                table: "SaleInvoices",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_SaleInvoices_Employees_EmployeeId",
                table: "SaleInvoices",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SaleOrderDetails_Products_ProductId",
                table: "SaleOrderDetails",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleOrders_Customers_CustomerId",
                table: "SaleOrders",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_SaleOrders_Employees_EmployeeId",
                table: "SaleOrders",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId");
        }
    }
}
