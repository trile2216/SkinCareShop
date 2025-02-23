using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Cart;
using api.DTOs.Products;

namespace api.Models
{
    public class CartItem
    {
        public int ProductId { get; set; }

        public CartItemDTO ItemDTO { get; set; } = null!;

        public int Quantity { get; set; }
    }
}