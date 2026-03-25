using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyStorePOSAPI.Data;
using MyStorePOSAPI.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OutletsController : ControllerBase
{
    private readonly POSPortalDbContext _context;

    public OutletsController(POSPortalDbContext context)
    {
        _context = context;
    }

    // 1. SELECT ALL
    [HttpGet]
    public IActionResult GetAll()
    {
        var outlets = _context.Outlets.ToList();
        return Ok(outlets);
    }

    // 2. SELECT BY ID
    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var outlet = _context.Outlets.FirstOrDefault(o => o.OutletId == id);
        if (outlet == null) return NotFound(new { message = "Outlet not found" });

        return Ok(outlet);
    }

    // 3. ADD NEW OUTLET
    [HttpPost]
    public IActionResult Create([FromBody] Outlet model)
    {
        if (_context.Outlets.Any(o => o.OutletId == model.OutletId))
        {
            return BadRequest(new { message = "Outlet ID already exists." });
        }
        if (_context.Outlets.Any(o => o.OutletName == model.OutletName))
        {
            return BadRequest(new { message = "Outlet Name already exists." });
        }

        // If you want to auto-generate the ID if it's empty:
        if (string.IsNullOrEmpty(model.OutletId))
        {
            model.OutletId = "OUT-" + System.Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }

        _context.Outlets.Add(model);
        _context.SaveChanges();

        return Ok(new { message = "Outlet created successfully", data = model });
    }

    // 4. EDIT OUTLET
    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] Outlet model)
    {
        // Check if another outlet already uses this name
        // Logic: Find any outlet where Name matches model.Name BUT ID is NOT the current ID
        if (_context.Outlets.Any(o => o.OutletName == model.OutletName && o.OutletId != id))
        {
            return BadRequest(new { message = "Outlet name already exists." });
        }

        var existingOutlet = _context.Outlets.FirstOrDefault(o => o.OutletId == id);
        if (existingOutlet == null) return NotFound(new { message = "Outlet not found" });

        // Update fields
        existingOutlet.OutletName = model.OutletName;
        existingOutlet.Location = model.Location;
        existingOutlet.ShortLocation = model.ShortLocation;
        // Note: Usually we don't update the OutletId itself as it is the primary key

        _context.SaveChanges();
        return Ok(new { message = "Outlet updated successfully" });
    }

    // 5. DELETE OUTLET
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var outlet = _context.Outlets.FirstOrDefault(o => o.OutletId == id);
        if (outlet == null) return NotFound();

        try
        {
            _context.Outlets.Remove(outlet);
            _context.SaveChanges();
            return Ok(new { message = "Outlet deleted successfully" });
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
        {
            // This block catches the 'SQLite Error 19: FOREIGN KEY constraint failed'
            // You can log 'ex' if you need details, but for the user:
            return BadRequest(new
            {
                message = "Cannot delete this outlet because it is currently assigned to users or has existing transactions. Please remove or reassign those records first."
            });
        }
        catch (Exception ex)
        {
            // A generic catch for any other unexpected errors
            return StatusCode(500, new { message = "An error occurred while deleting the outlet." });
        }
    }
}