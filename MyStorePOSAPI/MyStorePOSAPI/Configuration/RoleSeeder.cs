using Microsoft.AspNetCore.Identity;
using MyStorePOSAPI.Constants;
using MyStorePOSAPI.Models;
using System.Security.Claims;

namespace MyStorePOSAPI.Configuration
{
    public static class RoleSeeder
    {
        public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // 1. Define the core Roles
            string[] roles = {
                "IT Administrator",
                "Sale Man",
                "Sale Supervisor",
                "Inventory Manager"
            };

            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // 2. IT ADMINISTRATOR: Gets EVERYTHING
            var adminRole = await roleManager.FindByNameAsync(RoleConstants.Admin);
            if (adminRole != null)
            {
                await AssignPermissionsToRole(roleManager, adminRole, Permissions.GetAll());
            }

            // 3. SALE MAN: Basic permissions
            var saleManRole = await roleManager.FindByNameAsync(RoleConstants.SaleMan);
            if (saleManRole != null)
            {
                var saleManPerms = new List<string>
                {
                    Permissions.Sales.ViewSaleOrder,
                    Permissions.Sales.CreateSaleOrder,
                    Permissions.Sales.DeleteSaleOrder,
                    Permissions.Sales.DeleteSaleInvoice,
                    Permissions.Sales.ApprovalRequestSaleOrder,
                    Permissions.Sales.CancelRequestSaleOrder,
                    Permissions.Products.View,
                    Permissions.Customers.View,
                    Permissions.Customers.Create
                };
                await AssignPermissionsToRole(roleManager, saleManRole, saleManPerms);
            }

            // 4. SALE SUPERVISOR: Management permissions
            var supervisorRole = await roleManager.FindByNameAsync(RoleConstants.SaleSupervisor);
            if (supervisorRole != null)
            {
                var supervisorPerms = new List<string>
                {
                    Permissions.Sales.ViewSaleOrder,
                    Permissions.Sales.CreateSaleOrder,
                    Permissions.Sales.EditSaleOrder,
                    Permissions.Sales.ApprovedSaleOrder,
                    Permissions.Sales.CanceledSaleOrder,
                    Permissions.Sales.ViewSaleInvoice,
                    Permissions.Products.View,
                    Permissions.Customers.View,
                    Permissions.Customers.Edit
                };
                await AssignPermissionsToRole(roleManager, supervisorRole, supervisorPerms);
            }

            // 5. INVENTORY MANAGER: Stock control
            var inventoryRole = await roleManager.FindByNameAsync(RoleConstants.InventoryManager);
            if (inventoryRole != null)
            {
                var inventoryPerms = new List<string>
                {
                    Permissions.Products.View,
                    Permissions.Products.Create,
                    Permissions.Products.Edit,
                    Permissions.Products.Delete,
                    Permissions.Categories.View,
                    Permissions.Categories.Create,
                    Permissions.Categories.Edit,
                    Permissions.Categories.Delete,
                    Permissions.Inventories.View,
                    Permissions.Inventories.Create,
                    Permissions.Inventories.Edit,
                    Permissions.Inventories.Delete,
                    Permissions.Inventories.ManageStock
                };
                await AssignPermissionsToRole(roleManager, inventoryRole, inventoryPerms);
            }

            // 6. CREATE THE INITIAL ADMIN USER
            string adminEmail = "admin@starlink.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var newAdmin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Administrator",
                    EmailConfirmed = true,
                    StaffPin = "1234", // <--- ADD THIS LINE (or whatever default PIN you want)
                    //OutletId = "1"        // <--- Ensure StoreId is also provided if it's NOT NULL
                };

                var createResult = await userManager.CreateAsync(newAdmin, AuthConstants.DefaultPassword);

                if (createResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, RoleConstants.Admin);
                }
                else
                {
                    // Log errors if user creation fails (useful for debugging password requirements)
                    foreach (var error in createResult.Errors)
                    {
                        Console.WriteLine($"User Creation Error: {error.Description}");
                    }
                }
            }
        } // End of SeedRolesAsync

        private static async Task AssignPermissionsToRole(RoleManager<IdentityRole> roleManager, IdentityRole role, IEnumerable<string> permissions)
        {
            var existingClaims = await roleManager.GetClaimsAsync(role);
            foreach (var permission in permissions)
            {
                if (!existingClaims.Any(c => c.Type == "Permission" && c.Value == permission))
                {
                    await roleManager.AddClaimAsync(role, new Claim("Permission", permission));
                }
            }
        }
    }
}