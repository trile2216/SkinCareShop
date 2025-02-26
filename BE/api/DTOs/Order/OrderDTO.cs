using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.OrderItem;
using api.Enum;
using api.Models;

namespace api.DTOs.Order
{
    public class OrderDTO
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime OrderDate { get; set; }

        public OrderStatus Status { get; set; }

        public virtual List<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();
    }
}