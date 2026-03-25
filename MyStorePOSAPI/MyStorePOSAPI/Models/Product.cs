using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class Product
    {
        [Key]
        [MaxLength(16)]
        public string ProductId { get; set; }

        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; }

        [Required]
        public string CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal SellingPrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Cost { get; set; }

        public int StockQuantity { get; set; } = 0;

        public string? Description { get; set; }
    }
}
