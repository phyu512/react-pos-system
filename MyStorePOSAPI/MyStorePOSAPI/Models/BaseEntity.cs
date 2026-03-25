using System.ComponentModel.DataAnnotations;

namespace MyStorePOSAPI.Models
{
    public abstract class BaseEntity
    {
        [Key]
        [MaxLength(16)]
        public string Id { get; set; } = Guid.NewGuid().ToString("N").Substring(0, 16);
    }
}
