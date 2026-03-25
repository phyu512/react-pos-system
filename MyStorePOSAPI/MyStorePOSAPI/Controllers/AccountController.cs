using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyStorePOSAPI.Models;
using MyStorePOSAPI.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net;
using MyStorePOSAPI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService; // Add this line

    public AccountController(UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager, IConfiguration configuration, IEmailService emailService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _emailService = emailService; // Assign it here
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim("FullName", user.FullName ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

            var userRoles = await _userManager.GetRolesAsync(user);
            var permissionsList = new List<string>(); // We will fill this for the JSON response

            foreach (var roleName in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, roleName));

                var role = await _roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    var roleClaims = await _roleManager.GetClaimsAsync(role);
                    foreach (var claim in roleClaims)
                    {
                        authClaims.Add(claim);
                        // Add the permission value (e.g., "products.view") to our list
                        permissionsList.Add(claim.Value);
                    }
                }
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(8),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            // This matches the format your React Login.tsx expects
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                role = userRoles.FirstOrDefault() ?? "No Role", // Sends primary role
                permissions = permissionsList,               // Sends ["products.view", ...]
                user = new { user.Email, user.FullName }
            });
        }

        return Unauthorized(new { message = "Invalid email or password" });
    }
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email.ToUpper());
        if (user == null) return Ok();

        // 1. Generate the raw token
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        // 2. Encode it (Matches your ResetPassword logic)
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        // 3. Create the link
        var resetLink = $"https://localhost:5173/portal/reset-password?token={encodedToken}&email={user.Email}";

        var message = $"Please reset your password by <a href='{resetLink}'>clicking here</a>.";

        // NOW this will work!
        await _emailService.SendEmailAsync(model.Email, "Reset Password", message);

        return Ok(new { message = "Reset link sent successfully." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null) return BadRequest(new { message = "User not found." });

        // 1. Remove the old password without needing a token
        var removeResult = await _userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded) return BadRequest(removeResult.Errors);

        // 2. Add the new password
        var addResult = await _userManager.AddPasswordAsync(user, model.NewPassword);

        if (addResult.Succeeded)
            return Ok(new { message = "Password updated successfully." });

        return BadRequest(addResult.Errors);
    }

    [HttpPost("register")] // This makes the URL: api/Users/register
    public async Task<IActionResult> RegisterUser([FromBody] UserDto model)
    {
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            // RETURN THIS FOR SUCCESS
            return Ok(new { message = "Registration successful" });
        }

        return BadRequest(result.Errors);
    }
}