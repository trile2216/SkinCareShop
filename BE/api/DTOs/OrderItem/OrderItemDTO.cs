using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.OrderItem
{
    public class OrderItemDTO
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public string? ProductName { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }
    }
}