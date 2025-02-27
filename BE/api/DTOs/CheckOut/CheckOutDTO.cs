using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Cart;
using api.Enum;
using api.Models;

namespace api.DTOs.CheckOut
{
    public class CheckOutDTO
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public List<CartItem>? CartItems { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        [Range(0.01, 10000000000, ErrorMessage = "TotalPrice must be greater than 0")]
        public decimal TotalPrice { get; set; }

        [Required]
        public decimal ShippingFee { get; set; }
    }
}