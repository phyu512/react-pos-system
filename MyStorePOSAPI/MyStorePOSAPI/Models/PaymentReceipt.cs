using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class PaymentReceipt
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key to Customer 
        [ForeignKey("Customer")]
        public string CustomerId { get; set; }
        public Customer Customer { get; set; }

        // Foreign Key to SaleOrder 
        [ForeignKey("SaleOrder")]
        public string? SaleOrderId { get; set; }
        public SaleOrder? SaleOrder { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        public string Method { get; set; }

        public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;

        public ApprovalStatus Status { get; set; } = ApprovalStatus.Draft;

        // Foreign Key to ApprovedBy - identityuser 
        [ForeignKey("ApprovedBy")]
        public string? ApprovedById { get; set; }
        public ApplicationUser? ApprovedBy { get; set; }

        public DateTime? ApprovedAt { get; set; }
    }
}
