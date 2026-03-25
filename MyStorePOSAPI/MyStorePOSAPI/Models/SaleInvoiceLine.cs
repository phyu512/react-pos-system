using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class SaleInvoiceLine
    {
        public int Id { get; set; }
        [Required]
        public string InvoiceId { get; set; } = string.Empty;
        [ForeignKey("InvoiceId")]
        public virtual SaleInvoice Invoice { get; set; }

        public string ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalPrice { get; set; }
    }
}
