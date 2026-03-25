using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyStorePOSAPI.Models;
using static MyStorePOSAPI.Configuration.Permissions;

namespace MyStorePOSAPI.Data
{
    public class POSPortalDbContext : IdentityDbContext<ApplicationUser>
    {
        // THIS CONSTRUCTOR IS THE FIX:
        public POSPortalDbContext(DbContextOptions<POSPortalDbContext> options)
            : base(options)
        {
        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Outlet> Outlets { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<SaleOrder> SaleOrders { get; set; }
        public DbSet<SaleOrderDetail> SaleOrderDetails { get; set; }
        public DbSet<PaymentReceipt> PaymentReceipts { get; set; }
        public DbSet<SaleInvoice> SaleInvoices { get; set; }
        public DbSet<SaleInvoiceLine> SaleInvoiceLines { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<MenuRole> MenuRoles { get; set; }
        public DbSet<UserOutlet> UserOutlets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==========================================
            // 1. IDENTITY SYSTEM PROTECTION
            // ==========================================

            // UserRoles: If User is deleted, delete the link. 
            // If Role is deleted, BLOCK if users are still in it.
            modelBuilder.Entity<IdentityUserRole<string>>(entity => {
                entity.HasOne<ApplicationUser>().WithMany().HasForeignKey(ur => ur.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne<IdentityRole>().WithMany().HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.Restrict);
            });

            // Claims, Logins, and Tokens: Always Cascade. 
            // These are private to the user; if the user is gone, these must go.
            modelBuilder.Entity<IdentityUserClaim<string>>(entity => {
                entity.HasOne<ApplicationUser>().WithMany().HasForeignKey(uc => uc.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<IdentityUserLogin<string>>(entity => {
                entity.HasOne<ApplicationUser>().WithMany().HasForeignKey(ul => ul.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<IdentityUserToken<string>>(entity => {
                entity.HasOne<ApplicationUser>().WithMany().HasForeignKey(ut => ut.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            // ==========================================
            // 2. EMPLOYEE & USER LINK
            // ==========================================
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasOne(e => e.PortalUser)
                      .WithOne()
                      .HasForeignKey<Employee>(e => e.PortalUserId)
                      .OnDelete(DeleteBehavior.SetNull); // Keep history, lose the login link.

                entity.HasIndex(e => e.PortalUserId).IsUnique();
            });

            // ==========================================
            // 3. INVENTORY & PRODUCT PROTECTION
            // ==========================================
            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.HasIndex(i => new { i.ProductId, i.OutletId }).IsUnique();

                entity.HasOne(i => i.Product).WithMany().HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(i => i.Outlet).WithMany().HasForeignKey(i => i.OutletId).OnDelete(DeleteBehavior.Restrict);
            });

            // ==========================================
            // 4. MENU & ROLE MAPPING
            // ==========================================
            modelBuilder.Entity<MenuRole>(entity =>
            {
                entity.HasKey(mr => new { mr.MenuId, mr.RoleId });

                entity.HasOne(mr => mr.Menu).WithMany().HasForeignKey(mr => mr.MenuId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(mr => mr.Role).WithMany().HasForeignKey(mr => mr.RoleId).OnDelete(DeleteBehavior.Restrict);
            });

            // ==========================================
            // 5. USER OUTLET ASSIGNMENT
            // ==========================================
            modelBuilder.Entity<UserOutlet>(entity =>
            {
                entity.HasKey(uo => new { uo.UserId, uo.OutletId });

                // Change to Cascade: Deleting a User should remove their Outlet access automatically.
                entity.HasOne(uo => uo.User)
                      .WithMany(u => u.UserOutlets)
                      .HasForeignKey(uo => uo.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Keep Restrict: You cannot delete an Outlet if users are still assigned to it.
                entity.HasOne(uo => uo.Outlet)
                      .WithMany()
                      .HasForeignKey(uo => uo.OutletId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ==========================================
            // 6. SALES & TRANSACTIONS (AUDIT PROTECTION)
            // ==========================================
            modelBuilder.Entity<PaymentReceipt>(entity =>
            {
                entity.HasOne(pr => pr.Customer).WithMany().HasForeignKey(pr => pr.CustomerId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(pr => pr.SaleOrder).WithMany().HasForeignKey(pr => pr.SaleOrderId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(pr => pr.ApprovedBy).WithMany().HasForeignKey(pr => pr.ApprovedById).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<SaleInvoice>(entity =>
            {
                entity.HasOne(si => si.Customer).WithMany().HasForeignKey(si => si.CustomerId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(si => si.Employee).WithMany().HasForeignKey(si => si.EmployeeId).OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(si => si.InvoiceId).IsUnique();
            });

            modelBuilder.Entity<SaleInvoiceLine>(entity =>
            {
                entity.HasOne(sil => sil.Invoice).WithMany(si => si.InvoiceLines).HasForeignKey(sil => sil.InvoiceId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(sil => sil.Product).WithMany().HasForeignKey(sil => sil.ProductId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<SaleOrder>(entity =>
            {
                entity.HasOne(so => so.Customer).WithMany().HasForeignKey(so => so.CustomerId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(so => so.Employee).WithMany().HasForeignKey(so => so.EmployeeId).OnDelete(DeleteBehavior.Restrict);
                entity.HasMany(so => so.OrderItems).WithOne(d => d.SaleOrder).HasForeignKey(d => d.OrderId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<SaleOrderDetail>(entity =>
            {
                entity.HasOne(d => d.SaleOrder).WithMany(o => o.OrderItems).HasForeignKey(d => d.OrderId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(d => d.Product).WithMany().HasForeignKey(d => d.ProductId).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
