using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace PaymentIntegrationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PaymentConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("paypal-client-id")]
        public IActionResult GetPayPalClientId()
        {
            var clientId = _configuration["PayPal:ClientId"];
            if (string.IsNullOrEmpty(clientId))
            {
                return NotFound("PayPal Client ID not configured.");
            }
            return Ok(new { clientId });
        }
    }
}