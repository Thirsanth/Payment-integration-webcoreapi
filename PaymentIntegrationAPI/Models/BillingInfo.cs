namespace PaymentIntegrationAPI.Models
{
    public class BillingInfo
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Pincode { get; set; }
        public decimal Amount { get; set; }
        public string OrderId { get; set; }
    }
}