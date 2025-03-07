using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.OrderItem;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class OrderItemMappers
    {
        public static OrderItemDTO ToOrderItemDTO(this OrderItem orderItem)
        {
            return new OrderItemDTO
            {
                Id = orderItem.Id,
                ProductName = orderItem.Product.Name,
                ProductId = orderItem.ProductId,
                Quantity = orderItem.Quantity,
                UnitPrice = orderItem.UnitPrice
            };
        }

        public static OrderItem ToOrderItem(this OrderItemDTO orderItemDTO)
        {
            return new OrderItem
            {
                ProductId = orderItemDTO.ProductId,
                Quantity = orderItemDTO.Quantity,
                UnitPrice = orderItemDTO.UnitPrice
            };
        }

        public static OrderItem ToOrderItemFromCreateDTO(this CreateOrderItemDTO createOrderItemDTO, int orderId)
        {
            return new OrderItem
            {
                OrderId = orderId,
                ProductId = createOrderItemDTO.ProductId,
                Quantity = createOrderItemDTO.Quantity,
                UnitPrice = createOrderItemDTO.UnitPrice
            };
        }
    }
}