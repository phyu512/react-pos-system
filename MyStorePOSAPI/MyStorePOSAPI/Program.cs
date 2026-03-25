using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyStorePOSAPI.Configuration;
using MyStorePOSAPI.Data;
using MyStorePOSAPI.Models;
using MyStorePOSAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Use SQLite with that specific name/path
builder.Services.AddDbContext<POSPortalDbContext>(options =>
    options.UseSqlite(connectionString));

// 1. Define the CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://localhost:5173") // Your React URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Highly recommended for Identity/Auth setups

        });
});

//Register email service
builder.Services.AddScoped<IEmailService, EmailService>();

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Update this block
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<IdentityRole>() // <--- MUST ADD THIS to fix the RoleManager error
    .AddEntityFrameworkStores<POSPortalDbContext>()
    .AddDefaultTokenProviders(); // <--- ADD THIS LINE;

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false; // Temporarily disable for testing
    options.Password.RequiredLength = 6;
    // ...
});

// In Program.cs Add Authorization
builder.Services.AddAuthorization(options =>
{
    foreach (var permission in Permissions.GetAll())
    {
        options.AddPolicy(permission, policy =>
            policy.RequireClaim("Permission", permission));
    }
});

// Add JWT Bearer authentication
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

var app = builder.Build();

// In Program.cs seeding role 
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await RoleSeeder.SeedRolesAsync(services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. Identifying the route must happen first
app.UseRouting();

// 2. CORS MUST be after Routing and BEFORE Auth/Controllers
app.UseCors("AllowReactApp");

// 3. Authentication must happen BEFORE Authorization
app.UseAuthentication();
app.UseAuthorization();

// 4. Map your routes last
app.MapGroup("/auth").MapIdentityApi<ApplicationUser>();
app.MapControllers();

app.Run();