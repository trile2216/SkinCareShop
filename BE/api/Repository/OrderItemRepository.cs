using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderItem> CreateOrderItemAsync(OrderItem orderItem)
        {
            await _context.OrderItems.AddAsync(orderItem);
            await _context.SaveChangesAsync();
            return orderItem;
        }

        public async Task<OrderItem?> GetOrderItemByIdAsync(int id)
        {
            return await _context.OrderItems.FirstOrDefaultAsync(oi => oi.Id == id);
        }
        public async Task<List<OrderItem>> GetOrderItemsByOrderIdAsync(int orderId)
        {
            return await _context.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .Include(oi => oi.Product)
                .ToListAsync();
        }

        public async Task<OrderItem?> DeleteOrderItemByIdAsync(int id)
        {
            var item = await GetOrderItemByIdAsync(id);
            if (item == null)
            {
                return null;
            }
            _context.OrderItems.Remove(item);
            await _context.SaveChangesAsync();
            return item;
        }
    }
}