using Microsoft.AspNetCore.Identity;

namespace MyStorePOSAPI.Models
{
    public class MenuRole
    {
        public int MenuId { get; set; }
        public Menu Menu { get; set; }

        public string RoleId { get; set; }
        public IdentityRole Role { get; set; }
    }
}
