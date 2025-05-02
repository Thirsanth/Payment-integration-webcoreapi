using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;  // Required for accessing configuration
using Newtonsoft.Json;
using payment_integration.Models;
using Stripe;
using Stripe.Checkout;
using PaymentIntegrationAPI.Models;
using System;

namespace PaymentIntegrationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;  // Inject IConfiguration

        public PaymentController(IConfiguration configuration)
        {
            _configuration = configuration;
            // Get the Stripe secret key from configuration and set it
            var stripeSecretKey = _configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = stripeSecretKey;
        }

        [HttpGet("products")]
        public IActionResult GetProducts()
        {
            return Ok(new { message = "Product list would be here." });
        }

        [HttpPost("checkout")]
        public IActionResult Checkout([FromBody] CheckoutRequest request)
        {
            HttpContext.Session.SetString("Amount", request.Amount.ToString("F2"));
            return Ok(new { message = "Checkout successful." });
        }

        [HttpPost("billing-info")]
        public IActionResult SaveBillingInfo([FromBody] BillingInfo info)
        {
            HttpContext.Session.SetString("BillingInfo", JsonConvert.SerializeObject(info));
            return Ok(new { status = "success" });
        }

        [HttpGet("create-stripe-session")]
        public IActionResult CreateStripeSession(decimal amount)
        {
            try
            {
                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                                UnitAmount = (long)(amount * 100), // Stripe uses cents
                                Currency = "usd",
                                ProductData = new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = "Product Purchase"
                                }
                            },
                            Quantity = 1,
                        }
                    },
                    Mode = "payment",
                    SuccessUrl = "http://localhost:3000/order-success",
                    CancelUrl = "http://localhost:3000/products?status=failed"
                };

                var service = new SessionService();
                var session = service.Create(options);

                return Ok(new { sessionId = session.Id });
            }
            catch (StripeException ex)
            {
                // Handle Stripe-specific errors
                Console.WriteLine($"Stripe Error: {ex.Message}");
                return StatusCode(500, new { error = "Failed to create Stripe session." });
            }
        }
    }
}