using System.ComponentModel.DataAnnotations;

namespace MyStorePOSAPI.Models
{
    public class Outlet
    {
        [Key]
        [MaxLength(16)]
        public string OutletId { get; set; }

        [Required]
        public string OutletName { get; set; }

        public string? Location { get; set; }

        [MaxLength(3)]
        public string ShortLocation { get; set; }

        // Initialize to an empty collection to avoid NullReferenceExceptions
        public ICollection<UserOutlet> UserOutlets { get; set; } = new List<UserOutlet>();
    }
}
