namespace MyStorePOSAPI.Configuration
{
    public static class Permissions
    {
        public static class Customers
        {
            public const string View = "customers.view";
            public const string Create = "customers.create";
            public const string Edit = "customers.edit";
            public const string Delete = "customers.delete";
        }

        public static class Employees
        {
            public const string View = "employees.view";
            public const string Create = "employees.create";
            public const string Edit = "employees.edit";
            public const string Delete = "employees.delete";
        }

        public static class Categories
        {
            public const string View = "categories.view";
            public const string Create = "categories.create";
            public const string Edit = "categories.edit";
            public const string Delete = "categories.delete";
        }

        public static class Products
        {
            public const string View = "products.view";
            public const string Create = "products.create";
            public const string Edit = "products.edit";
            public const string Delete = "products.delete";
        }

        public static class Outlets
        {
           
        }

        public static class Inventories
        {
            public const string View = "inventories.view";
            public const string Create = "inventories.create";
            public const string Edit = "inventories.edit";
            public const string Delete = "inventories.delete";
            public const string ManageStock = "inventories.stock.manage"; // For stock-in/stock-out
        }

        public static class Sales
        {
            public const string ViewSaleOrder = "sales.orders.view";
            public const string CreateSaleOrder = "sales.orders.create";
            public const string EditSaleOrder = "sales.orders.edit";
            public const string DeleteSaleOrder = "sales.orders.delete";

            public const string ApprovalRequestSaleOrder = "sales.orders.approvalrequest";
            public const string CancelRequestSaleOrder = "sales.orders.cancelrequest";
            public const string ApprovedSaleOrder = "sales.orders.approved";
            public const string CanceledSaleOrder = "sales.orders.canceled";

            public const string ViewSaleInvoice = "sales.invoices.view";
            public const string CreateSaleInvoice = "sales.invoices.create";
            public const string EditSaleInvoice = "sales.invoices.edit";
            public const string DeleteSaleInvoice = "sales.invoices.delete";

            public const string ApprovalRequestSaleInvoice = "sales.invoices.approvalrequest";
            public const string CancelRequestSaleInvoice = "sales.invoices.cancelrequest";
            public const string ApprovedSaleInvoice = "sales.invoices.approved";
            public const string CanceledSaleInvoice = "sales.invoices.canceled";
        }

        public static class Administration
        {
            public const string ViewUsers = "admin.users.view";
            public const string EditUsers = "admin.users.edit";          // Details ONLY
            public const string AssignRoles = "admin.users.assign_role"; // Security ONLY
            // Role Management
            public const string ViewRoles = "admin.roles.view";
            public const string CreateRoles = "admin.roles.create";
            public const string EditRoles = "admin.roles.edit";
            public const string DeleteRoles = "admin.roles.delete";
            // Menu Management
            public const string ViewMenus = "admin.menus.view";     // Permission to see the Menu List in Settings
            public const string CreateMenus = "admin.menus.create"; // Permission to add a new Menu link
            public const string EditMenus = "admin.menus.edit";     // Permission to rename or reorder menus
            public const string DeleteMenus = "admin.menus.delete"; // Permission to remove a menu
            public const string AssignMenus = "admin.menus.assign"; // Permission to link a Menu to a Role
            // Outlet Management
            public const string ViewOutlets = "admin.outlets.view";
            public const string CreateOutlet = "admin.outlets.create";
            public const string EditOutlet = "admin.outlets.edit";
            public const string DeleteOutlet = "admin.outlets.delete";
        }

        // Helper method to get all permissions for the loop in Program.cs
        public static List<string> GetAll()
        {
            return new List<string>
            {
                Customers.View, Customers.Create, Customers.Edit, Customers.Delete,
                Employees.View, Employees.Create, Employees.Edit, Employees.Delete,
                Categories.View, Categories.Create, Categories.Edit, Categories.Delete,
                Products.View, Products.Create, Products.Edit, Products.Delete,
                Inventories.View, Inventories.Create, Inventories.Edit, Inventories.Delete, Inventories.ManageStock,
        
                // Sales Orders
                Sales.ViewSaleOrder, Sales.CreateSaleOrder, Sales.EditSaleOrder, Sales.DeleteSaleOrder,
                Sales.ApprovalRequestSaleOrder, Sales.CancelRequestSaleOrder, Sales.ApprovedSaleOrder, Sales.CanceledSaleOrder,
        
                // Sales Invoices
                Sales.ViewSaleInvoice, Sales.CreateSaleInvoice, Sales.EditSaleInvoice, Sales.DeleteSaleInvoice,
                Sales.ApprovalRequestSaleInvoice, Sales.CancelRequestSaleInvoice, Sales.ApprovedSaleInvoice, Sales.CanceledSaleInvoice,
        
                // Administration (Added the missing role/user assignment strings)
                Administration.ViewUsers, Administration.EditUsers, Administration.AssignRoles,
                Administration.ViewRoles, Administration.CreateRoles, Administration.EditRoles, Administration.DeleteRoles,
                Administration.ViewOutlets, Administration.CreateOutlet, Administration.EditOutlet, Administration.DeleteOutlet,
                Administration.ViewMenus, Administration.CreateMenus, Administration.EditMenus, Administration.DeleteMenus, Administration.AssignMenus
            };
        }
    }
}
