using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Constant;
using api.Data;
using api.DTOs.Dashboard;
using api.Interface;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class DashboardRepository : IDashBoardRepository
    {
        private readonly ApplicationDbContext _context;

        public DashboardRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<SummaryDTO> GetSummaryData()
        {
            return new SummaryDTO
            {
                TotalOrders = await _context.Orders.CountAsync(),
                TotalProducts = await _context.Products.CountAsync(),
                TotalCustomers = await _context.Customers.CountAsync(),
                TotalCategories = await _context.Categories.CountAsync(),
                TotalBrands = await _context.Brands.CountAsync(),
                TotalRevenue = await _context.Orders
                        .Where(o => o.Status == OrderStatus.Delivered)
                        .SumAsync(o => o.TotalPrice)
            };
        }

        public async Task<List<TopProductDTO>> GetTopProducts()
        {
            var topProducts = await _context.OrderItems
                   .GroupBy(oi => oi.ProductId)
                   .Select(g => new
                   {
                       ProductId = g.Key,
                       TotalSold = g.Sum(oi => oi.Quantity)
                   })
                   .OrderByDescending(x => x.TotalSold)
                   .Take(5)
                   .Join(_context.Products,
                       tp => tp.ProductId,
                       p => p.Id,
                       (tp, p) => new TopProductDTO
                       {
                           Id = p.Id,
                           Name = p.Name,
                           Price = p.Price,
                           Image = p.Image,
                           TotalSold = tp.TotalSold
                       })
                   .ToListAsync();
            return topProducts;
        }

        public async Task<List<RecentOrderDTO>> GetRecentOrders()
        {
            var recentOrders = await _context.Orders
                    .OrderByDescending(o => o.OrderDate)
                    .Take(5)
                    .Select(o => new RecentOrderDTO
                    {
                        Id = o.Id,
                        OrderDate = o.OrderDate.ToString(),
                        TotalPrice = o.TotalPrice,
                        ShippingFee = o.ShippingFee,
                        Status = o.Status.ToString(),
                        CustomerName = o.Customer.FirstName + " " + o.Customer.LastName
                    })
                    .ToListAsync();
            return recentOrders;
        }

        public async Task<List<OrderStatusDTO>> GetOrderByStatus()
        {
            var ordersByStatus = await _context.Orders
                          .GroupBy(o => o.Status)
                          .Select(g => new OrderStatusDTO
                          {
                              Status = g.Key.ToString(),
                              Count = g.Count()
                          })
                          .ToListAsync();
            return ordersByStatus;
        }
    }
}