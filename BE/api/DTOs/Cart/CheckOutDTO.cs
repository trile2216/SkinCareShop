using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enum;

namespace api.DTOs.Cart
{
    public class CheckOutDTO
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public List<CartItemDTO>? CartItems { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }
    }
}