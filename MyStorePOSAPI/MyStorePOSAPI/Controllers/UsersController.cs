using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyStorePOSAPI.Data;
using MyStorePOSAPI.DTOs;
using MyStorePOSAPI.Models;
using System.Security.Claims;

namespace MyStorePOSAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Only logged-in users can see the list
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly POSPortalDbContext _context; // <--- 1. Declare the field

        public UsersController(UserManager<ApplicationUser> userManager, POSPortalDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userList = new List<object>();

            foreach (var user in users)
            {
                // Fetch roles for each user
                var roles = await _userManager.GetRolesAsync(user);

                userList.Add(new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    Role = roles.FirstOrDefault() ?? "No Role",
                    Status = "Active" // You can add logic here for LockoutEnabled
                    
                });
            }

            return Ok(userList);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                StaffPin = model.StaffPin
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Assign the selected role
                if (!string.IsNullOrEmpty(model.Role))
                {
                    await _userManager.AddToRoleAsync(user, model.Role);
                }
                return Ok(new { message = "User created successfully!" });
            }

            return BadRequest(result.Errors);
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            // 1. Query via DbContext to ensure .Include() is respected by EF Core
            var user = await _context.Users
                .Include(u => u.UserOutlets)
                .FirstOrDefaultAsync(u => u.Id == id);

            // 2. Handle null case
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // 3. Get roles via UserManager (this remains the best way for roles)
            var roles = await _userManager.GetRolesAsync(user);

            // 4. Return the flattened object
            return Ok(new
            {
                fullName = user.FullName,
                email = user.Email,
                role = roles.FirstOrDefault(),
                staffPin = user.StaffPin,

                // This will now contain the IDs as a simple string array/list
                outletIds = user.UserOutlets
                    .Select(uo => uo.OutletId)
                    .ToList()
            });
        }

        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDto model)
        {
            // 1. Fetch user including the junction table
            var user = await _userManager.Users
                .Include(u => u.UserOutlets)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();

            user.FullName = model.FullName;
            //user.Email = model.Email; // Optional: usually kept disabled in UI
            user.StaffPin = model.StaffPin; 

            // 2. HANDLE PASSWORD RESET (The "Reset to Default" logic)
            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                // Identity doesn't allow direct password overwrites for security.
                // We remove the old one and add the new one (the default password sent from React).
                var removeResult = await _userManager.RemovePasswordAsync(user);
                if (removeResult.Succeeded)
                {
                    await _userManager.AddPasswordAsync(user, model.Password);
                }
            }

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                // --- SYNC OUTLETS START ---

                // A. Remove existing assignments
                var existingAssignments = _context.UserOutlets.Where(uo => uo.UserId == id);
                _context.UserOutlets.RemoveRange(existingAssignments);

                // B. Add new assignments from React
                if (model.OutletIds != null && model.OutletIds.Any())
                {
                    foreach (var oId in model.OutletIds)
                    {
                        _context.UserOutlets.Add(new UserOutlet
                        {
                            UserId = id,
                            OutletId = oId
                        });
                    }
                }

                await _context.SaveChangesAsync();
                // --- SYNC OUTLETS END ---

                // Update Role (Your existing logic)
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, model.Role);

                return Ok(new { message = "Update Successful" });
            }
            return BadRequest(result.Errors);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            // Prevent self-deletion
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == id)
                return BadRequest(new { message = "You cannot delete your own account." });

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            try
            {
                // Because of 'Restrict', this will fail if any Roles, Claims, 
                // Logins, or Tokens exist in the database.
                var result = await _userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    return Ok(new { message = "User deleted successfully." });
                }
                return BadRequest(result.Errors);
            }
            catch (DbUpdateException)
            {
                // This is the message your React 'error' banner will show
                return BadRequest(new
                {
                    message = "This user is protected. You must remove all assigned Roles, Claims, and active Sessions before this account can be deleted."
                });
            }
        }
    }
}
