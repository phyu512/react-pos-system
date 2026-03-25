using System.ComponentModel.DataAnnotations;

namespace MyStorePOSAPI.Models
{
    public class Category
    {
        [Key]
        [MaxLength(16)]
        public string CategoryId { get; set; } = Guid.NewGuid().ToString("N").Substring(0, 16);

        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; }
    }
}
