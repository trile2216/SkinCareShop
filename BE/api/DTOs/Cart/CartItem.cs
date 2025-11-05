using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Cart;
using api.DTOs.Products;

namespace api.DTOs.Cart
{
    public class CartItem
    {

        public int ProductId { get; set; }

        public string? ProductImage { get; set; } = String.Empty;

        public string ProductName { get; set; } = String.Empty;

        public decimal ProductPrice { get; set; }

        public decimal? ProductSale { get; set; }

        public int Quantity { get; set; }
    }
}