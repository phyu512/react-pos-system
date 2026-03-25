using System.ComponentModel.DataAnnotations;

namespace MyStorePOSAPI.Models
{
    public class Inventory
    {
        [Key]
        [MaxLength(16)]
        public string InventoryId { get; set; } = Guid.NewGuid().ToString("N").Substring(0, 16);

        public string ProductId { get; set; }
        public Product Product { get; set; }

        public string OutletId { get; set; }
        public Outlet Outlet { get; set; }

        public int Quantity { get; set; }
    }
}
