using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Enum;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            return order;
        }

        public Task<List<Order>> GetOrdersAsync()
        {
            return _context.Orders
                .Include(o => o.OrderItems)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }


        public async Task<Order?> CancelOrderAsync(int orderId)
        {
            var order = await GetOrderByIdAsync(orderId);

            if (order == null)
            {
                return null;
            }

            order.Status = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();

            return order;

        }

        public async Task<List<Order>> GetOrderByCustomerIdAsync(int CustomerId)
        {
            return await _context.Orders
                .Where(o => o.CustomerId == CustomerId)
                .Include(o => o.OrderItems)
                .ToListAsync();
        }




        public async Task<Order?> UpdateOrderStatusAsync(int id, OrderStatus orderStatus)
        {
            var existingOrder = await GetOrderByIdAsync(id);

            if (existingOrder == null)
            {
                return null;
            }

            existingOrder.Status = orderStatus;

            await _context.SaveChangesAsync();
            return existingOrder;
        }
    }
}