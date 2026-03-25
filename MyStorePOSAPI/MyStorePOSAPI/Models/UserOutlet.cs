namespace MyStorePOSAPI.Models
{
    public class UserOutlet
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public string OutletId { get; set; }
        public Outlet Outlet { get; set; }
    }
}
