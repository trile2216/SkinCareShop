using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.CheckOut
{
    public class PaymentInformationModel
    {
        public string OrderType { get; set; }
        public double Amount { get; set; }

        public double ShippingFee { get; set; }

        public string OrderDescription { get; set; }
        
        public string DeliveryAddress { get; set; }

        public string Name { get; set; }
    }
}