using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Dashboard
{
    public class SummaryDTO
    {
        public int TotalCustomers { get; set; }
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCategories { get; set; }
        public int TotalBrands { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}