using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Dashboard
{
    public class DashboardResponseDTO
    {
        public SummaryDTO Summary { get; set; }
        public List<RecentOrderDTO> RecentOrders { get; set; }
        public List<TopProductDTO> TopProducts { get; set; }
        public List<OrderStatusDTO> OrdersByStatus { get; set; }
    }
}