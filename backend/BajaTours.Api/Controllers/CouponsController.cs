using BajaTours.Api.DTOs.Coupons;
using BajaTours.Api.Services.Coupons;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/coupons")]
public class CouponsController : ControllerBase
{
    private readonly ICouponsService _coupons;
    public CouponsController(ICouponsService coupons) => _coupons = coupons;

    /// <summary>Preview a coupon's effect on a subtotal. Used by the booking checkout
    /// to show the discount before the user clicks "Pagar".</summary>
    [HttpPost("validate")]
    public async Task<ActionResult<ValidateCouponResponse>> Validate([FromBody] ValidateCouponRequest req, CancellationToken ct)
        => Ok(await _coupons.ValidateForPreviewAsync(req.Code, req.Subtotal, ct));
}
