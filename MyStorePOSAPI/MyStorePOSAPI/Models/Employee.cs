using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class Employee
    {
        [Key]
        [MaxLength(16)]
        public string EmployeeId { get; set; } = string.Empty;

        // Foreign Key to AspNetUsers (IdentityUser)
        [ForeignKey("PortalUser")]
        public string? PortalUserId { get; set; }

        // Navigation property
        public ApplicationUser? PortalUser { get; set; }

        [Required]
        [MaxLength(150)]
        public string EmployeeName { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? Position { get; set; }

        public bool IsActive { get; set; } = true; 
    }
}
