using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.OrderItem;
using api.Constant;

namespace api.DTOs.Order
{
    public class CreateOrderDTO
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }


        [Required]
        public decimal ShippingFee { get; set; }

        [Required]
        public string DeliveryAddress { get; set; }

        [Required]
        public OrderStatus Status { get; set; }

        [Required]
        public List<CreateOrderItemDTO> OrderItems { get; set; } = new List<CreateOrderItemDTO>();
    }
}