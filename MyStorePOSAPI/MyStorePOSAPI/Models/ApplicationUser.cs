using Microsoft.AspNetCore.Identity;

namespace MyStorePOSAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string? StaffPin { get; set; } // Hashed pin for quick login
        public ICollection<UserOutlet> UserOutlets { get; set; }
    }
}
