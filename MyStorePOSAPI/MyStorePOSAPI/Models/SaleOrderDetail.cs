using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class SaleOrderDetail
    {
        [Key]
        [MaxLength(16)]
        public string OrderItemId { get; set; } = string.Empty;

        [Required]
        public string OrderId { get; set; } = string.Empty;

        [ForeignKey("OrderId")]
        public virtual SaleOrder SaleOrder { get; set; }

        [Required]
        public string ProductId { get; set; } = string.Empty;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public ApprovalStatus Status { get; set; } = ApprovalStatus.Draft;
    }
}
