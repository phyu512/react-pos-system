namespace MyStorePOSAPI.DTOs
{
    public class UserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string StaffPin { get; set;  } = string.Empty;
        // ADD THIS LINE:
        public List<string>? OutletIds { get; set; }
    }
}
