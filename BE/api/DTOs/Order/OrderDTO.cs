using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.OrderItem;
using api.Constant;
using api.Models;

namespace api.DTOs.Order
{
    public class OrderDTO
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal ShippingFee { get; set; }

        public string? DeliveryAddress { get; set; }

        public string? TransactionId { get; set; }

        public string? PaymentMethod { get; set; }

        public string OrderDate { get; set; }

        public string? Status { get; set; }

        public virtual List<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();
    }
}