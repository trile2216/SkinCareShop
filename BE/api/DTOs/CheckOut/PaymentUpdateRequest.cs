using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.CheckOut
{
    public class PaymentUpdateRequest
    {
        public int OrderId { get; set; }
        public string ResponseCode { get; set; }
        public string TransactionId { get; set; }
        public string PaymentMethod { get; set; }
    }
}
