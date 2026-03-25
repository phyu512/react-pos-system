using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class SaleOrder
    {
        [Key]
        [MaxLength(16)]
        public string OrderId { get; set; }

        public string? CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string? EmployeeId { get; set; }
        public Employee? Employee { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ApprovalStatus Status { get; set; } = ApprovalStatus.Draft;

        // FIXED: Initialize the collection to avoid NullReferenceException 
        public virtual ICollection<SaleOrderDetail> OrderItems { get; set; } = new List<SaleOrderDetail>();
    }
}
