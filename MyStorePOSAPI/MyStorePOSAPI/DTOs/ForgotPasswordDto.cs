using System.ComponentModel.DataAnnotations;

namespace MyStorePOSAPI.DTOs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
