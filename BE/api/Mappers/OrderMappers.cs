using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Order;
using api.Models;

namespace api.Mappers
{
    public static class OrderMappers
    {
        public static Order ToOrderFromCreateDTO(this CreateOrderDTO createOrderDTO)
        {
            return new Order
            {
                CustomerId = createOrderDTO.CustomerId,
                TotalPrice = createOrderDTO.TotalPrice,
                OrderDate = createOrderDTO.OrderDate,
                Status = createOrderDTO.Status,
            };
        }

        public static OrderDTO ToOrderDTO(this Order order)
        {
            return new OrderDTO
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                TotalPrice = order.TotalPrice,
                OrderDate = order.OrderDate,
                Status = order.Status,
                OrderItems = order.OrderItems.Select(x => x.ToOrderItemDTO()).ToList()
            };
        }
    }
}