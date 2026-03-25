using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyStorePOSAPI.Models
{
    public class SaleInvoice
    {
        [Key]
        [MaxLength(20)]
        public string InvoiceId { get; set; } = string.Empty;

        public string? CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public Customer? Customer { get; set; }

        public string? EmployeeId { get; set; }
        [ForeignKey("EmployeeId")]
        public Employee? Employee { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal Tax { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; }

        public ApprovalStatus Status { get; set; } = ApprovalStatus.Draft;

        // FIXED: Initialize the collection to prevent the "red line" or Null Errors
        public virtual ICollection<SaleInvoiceLine> InvoiceLines { get; set; } = new List<SaleInvoiceLine>();
    }
}
