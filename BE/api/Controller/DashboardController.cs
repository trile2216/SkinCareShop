using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashBoardRepository _dashboardRepository;

        public DashboardController(IDashBoardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        [HttpGet]
        [Route("summary")]
        public async Task<IActionResult> GetSummaryData()
        {
            var summary = await _dashboardRepository.GetSummaryData();
            return Ok(summary);
        }

        [HttpGet]
        [Route("top-products")]
        public async Task<IActionResult> GetTopProducts()
        {
            var topProducts = await _dashboardRepository.GetTopProducts();
            return Ok(topProducts);
        }

        [HttpGet]
        [Route("recent-orders")]
        public async Task<IActionResult> GetRecentOrders()
        {
            var recentOrders = await _dashboardRepository.GetRecentOrders();
            return Ok(recentOrders);
        }

        [HttpGet]
        [Route("order-status")]
        public async Task<IActionResult> GetOrderByStatus()
        {
            var orderStatus = await _dashboardRepository.GetOrderByStatus();
            return Ok(orderStatus);
        }
    }
}