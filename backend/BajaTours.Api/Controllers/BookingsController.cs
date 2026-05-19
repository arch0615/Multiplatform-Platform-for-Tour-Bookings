using System.Security.Claims;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Bookings;
using BajaTours.Api.DTOs.Reviews;
using BajaTours.Api.Services.Bookings;
using BajaTours.Api.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookings;
    private readonly IReviewsService _reviews;

    public BookingsController(IBookingService bookings, IReviewsService reviews)
    {
        _bookings = bookings;
        _reviews = reviews;
    }

    [HttpPost]
    [EnableRateLimiting("bookings")]
    public async Task<ActionResult<CreateBookingResponse>> Create([FromBody] CreateBookingRequest req, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        try
        {
            var result = await _bookings.CreateAsync(userId, req, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Booking.Id }, result);
        }
        catch (BookingException ex) when (ex.Error == BookingError.TourNotFound)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (BookingException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookingDto>> GetById(Guid id, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        var role = ResolveRole();

        try
        {
            var dto = await _bookings.GetAsync(userId, role, id, ct);
            return Ok(dto);
        }
        catch (BookingException ex) when (ex.Error == BookingError.BookingNotFound)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (BookingException ex) when (ex.Error == BookingError.NotAuthorized)
        {
            return Forbid();
        }
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<ActionResult<BookingDto>> Cancel(Guid id, [FromBody] CancelBookingRequest req, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        var role = ResolveRole();

        try
        {
            var dto = await _bookings.CancelAsync(userId, role, id, req, ct);
            return Ok(dto);
        }
        catch (BookingException ex) when (ex.Error == BookingError.BookingNotFound)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (BookingException ex) when (ex.Error == BookingError.NotAuthorized)
        {
            return Forbid();
        }
        catch (BookingException ex) when (ex.Error == BookingError.NotCancellable)
        {
            return Conflict(new { error = ex.Message });
        }
        catch (BookingException ex) when (ex.Error == BookingError.RefundFailed)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new { error = ex.Message });
        }
    }

    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<BookingDto>>> ListMine(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        var list = await _bookings.ListForUserAsync(userId, ct);
        return Ok(list);
    }

    [HttpPost("{id:guid}/review")]
    public async Task<ActionResult<AdminReviewDto>> SubmitReview(Guid id, [FromBody] SubmitReviewRequest req, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            var dto = await _reviews.SubmitForBookingAsync(userId, id, req, ct);
            return Ok(dto);
        }
        catch (ReviewException ex) when (ex.Error == ReviewError.BookingNotFound)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (ReviewException ex) when (ex.Error == ReviewError.NotOwner)
        {
            return Forbid();
        }
        catch (ReviewException ex) when (ex.Error == ReviewError.NotCompleted
                                       || ex.Error == ReviewError.AlreadyReviewed)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    private bool TryGetUserId(out Guid userId)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(sub, out userId);
    }

    private UserRole ResolveRole()
    {
        var raw = User.FindFirstValue(ClaimTypes.Role);
        return Enum.TryParse<UserRole>(raw, out var r) ? r : UserRole.Client;
    }
}
