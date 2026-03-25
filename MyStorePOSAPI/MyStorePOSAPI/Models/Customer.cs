using System.ComponentModel.DataAnnotations;

namespace MyStorePOSAPI.Models
{
    public class Customer
    {
        [Key]
        [MaxLength(16)]
        public string CustomerId { get; set; } = string.Empty; // Ensure it's not null

        [Required] // Name should usually be mandatory
        [MaxLength(150)]
        public string CustomerName { get; set; } = string.Empty;

        [EmailAddress] // Provides automatic validation for emails
        public string? Email { get; set; }

        public string? Phone { get; set; }
        public string? Address { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
