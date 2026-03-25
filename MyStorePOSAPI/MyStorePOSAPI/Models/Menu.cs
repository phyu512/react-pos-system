using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class Menu
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string? UrlName { get; set; }
        public string? Icon { get; set; }

        public int? ParentId { get; set; }
        public Menu? Parent { get; set; }
        public ICollection<Menu>? Children { get; set; } = new List<Menu>();

        public int Order { get; set; }
        public bool IsActive { get; set; } = true;

        // 🔹 FIX: Initialize collection
        public ICollection<MenuRole> MenuRoles { get; set; } = new List<MenuRole>();
    }
}
