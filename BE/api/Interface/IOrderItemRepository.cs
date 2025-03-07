using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Interface
{
    public interface IOrderItemRepository
    {
        Task<OrderItem> CreateOrderItemAsync(OrderItem orderItem);

        Task<List<OrderItem>> GetOrderItemsByOrderIdAsync(int orderId);

        Task<OrderItem?> DeleteOrderItemByIdAsync(int id);
    }
}