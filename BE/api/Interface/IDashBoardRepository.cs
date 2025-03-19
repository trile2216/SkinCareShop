using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Dashboard;

namespace api.Interface
{
    public interface IDashBoardRepository
    {
        Task<SummaryDTO> GetSummaryData();

        Task<List<RecentOrderDTO>> GetRecentOrders();

        Task<List<TopProductDTO>> GetTopProducts();

        Task<List<OrderStatusDTO>> GetOrderByStatus();
    }
}