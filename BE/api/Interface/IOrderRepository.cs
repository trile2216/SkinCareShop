using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Order;
using api.Enum;
using api.Models;

namespace api.Interface
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);

        Task<Order?> GetOrderByIdAsync(int orderId);

        Task<List<Order>> GetOrdersAsync();

        Task<Order?> UpdateOrderStatusAsync(int id, OrderStatus orderStatus);

        Task<Order?> CancelOrderAsync(int orderId);

        Task<Order?> GetOrderByCustomerIdAsync(int CustomerId);
    }
}