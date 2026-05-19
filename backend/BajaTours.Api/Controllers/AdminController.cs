using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Admin;
using BajaTours.Api.DTOs.Coupons;
using BajaTours.Api.DTOs.Reviews;
using BajaTours.Api.Services.Admin;
using BajaTours.Api.Services.Coupons;
using BajaTours.Api.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _svc;
    private readonly IReviewsService _reviews;
    private readonly ICouponsService _coupons;

    public AdminController(IAdminService svc, IReviewsService reviews, ICouponsService coupons)
    {
        _svc = svc;
        _reviews = reviews;
        _coupons = coupons;
    }

    [HttpGet("dashboard-stats")]
    public async Task<ActionResult<AdminDashboardStatsDto>> Stats(CancellationToken ct)
        => Ok(await _svc.GetDashboardStatsAsync(ct));

    [HttpGet("providers")]
    public async Task<ActionResult<IReadOnlyList<AdminProviderDto>>> ListProviders(
        [FromQuery] ProviderStatus? status,
        [FromQuery] string? q,
        CancellationToken ct)
        => Ok(await _svc.ListProvidersAsync(status, q, ct));

    [HttpPost("providers/{id:guid}/verify")]
    public async Task<ActionResult<AdminProviderDto>> Verify(Guid id, CancellationToken ct)
    {
        try { return Ok(await _svc.VerifyProviderAsync(id, ct)); }
        catch (AdminException ex) when (ex.Error == AdminError.ProviderNotFound) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPost("providers/{id:guid}/suspend")]
    public async Task<ActionResult<AdminProviderDto>> Suspend(Guid id, [FromBody] SuspendProviderRequest? req, CancellationToken ct)
    {
        try { return Ok(await _svc.SuspendProviderAsync(id, req?.Reason, ct)); }
        catch (AdminException ex) when (ex.Error == AdminError.ProviderNotFound) { return NotFound(new { error = ex.Message }); }
    }

    [HttpGet("bookings")]
    public async Task<ActionResult<IReadOnlyList<AdminBookingDto>>> ListBookings(
        [FromQuery] BookingStatus? status,
        [FromQuery] Guid? providerId,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken ct)
        => Ok(await _svc.ListBookingsAsync(status, providerId, from, to, ct));

    [HttpGet("reviews")]
    public async Task<ActionResult<IReadOnlyList<AdminReviewDto>>> ListReviews(
        [FromQuery] ReviewStatus? status,
        CancellationToken ct)
        => Ok(await _reviews.ListAdminAsync(status, ct));

    [HttpPost("reviews/{id:guid}/approve")]
    public async Task<ActionResult<AdminReviewDto>> ApproveReview(Guid id, CancellationToken ct)
    {
        try { return Ok(await _reviews.ApproveAsync(id, ct)); }
        catch (ReviewException ex) when (ex.Error == ReviewError.ReviewNotFound) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPost("reviews/{id:guid}/reject")]
    public async Task<ActionResult<AdminReviewDto>> RejectReview(Guid id, CancellationToken ct)
    {
        try { return Ok(await _reviews.RejectAsync(id, ct)); }
        catch (ReviewException ex) when (ex.Error == ReviewError.ReviewNotFound) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPost("reviews/import")]
    public async Task<ActionResult<AdminReviewDto>> ImportReview([FromBody] ImportReviewRequest req, CancellationToken ct)
    {
        try { return Ok(await _reviews.ImportExternalAsync(req, ct)); }
        catch (ReviewException ex) when (ex.Error == ReviewError.TourNotFound) { return NotFound(new { error = ex.Message }); }
    }

    // ---------- Coupons ----------

    [HttpGet("coupons")]
    public async Task<ActionResult<IReadOnlyList<CouponDto>>> ListCoupons(CancellationToken ct)
        => Ok(await _coupons.ListAsync(ct));

    [HttpGet("coupons/{id:guid}")]
    public async Task<ActionResult<CouponDto>> GetCoupon(Guid id, CancellationToken ct)
    {
        try { return Ok(await _coupons.GetAsync(id, ct)); }
        catch (CouponException ex) when (ex.Error == CouponError.NotFound) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPost("coupons")]
    public async Task<ActionResult<CouponDto>> CreateCoupon([FromBody] WriteCouponRequest req, CancellationToken ct)
    {
        try
        {
            var dto = await _coupons.CreateAsync(req, ct);
            return CreatedAtAction(nameof(GetCoupon), new { id = dto.Id }, dto);
        }
        catch (CouponException ex) when (ex.Error == CouponError.DuplicateCode) { return Conflict(new { error = ex.Message }); }
        catch (CouponException ex) when (ex.Error == CouponError.InvalidConfig) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpPut("coupons/{id:guid}")]
    public async Task<ActionResult<CouponDto>> UpdateCoupon(Guid id, [FromBody] WriteCouponRequest req, CancellationToken ct)
    {
        try { return Ok(await _coupons.UpdateAsync(id, req, ct)); }
        catch (CouponException ex) when (ex.Error == CouponError.NotFound) { return NotFound(new { error = ex.Message }); }
        catch (CouponException ex) when (ex.Error == CouponError.DuplicateCode) { return Conflict(new { error = ex.Message }); }
        catch (CouponException ex) when (ex.Error == CouponError.InvalidConfig) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpDelete("coupons/{id:guid}")]
    public async Task<ActionResult<CouponDto>> ArchiveCoupon(Guid id, CancellationToken ct)
    {
        try { return Ok(await _coupons.ArchiveAsync(id, ct)); }
        catch (CouponException ex) when (ex.Error == CouponError.NotFound) { return NotFound(new { error = ex.Message }); }
    }
}
