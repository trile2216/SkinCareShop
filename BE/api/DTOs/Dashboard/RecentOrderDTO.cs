using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Dashboard
{
    public class RecentOrderDTO
    {
        public int Id { get; set; }
        public string OrderDate { get; set; }
        public decimal TotalPrice { get; set; }

        public decimal ShippingFee { get; set; }
        public string Status { get; set; }
        public string CustomerName { get; set; }
    }
}
