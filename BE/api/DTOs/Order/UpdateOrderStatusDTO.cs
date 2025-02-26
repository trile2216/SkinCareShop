using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enum;

namespace api.DTOs.Order
{
    public class UpdateOrderStatusDTO
    {
        [Required]
        OrderStatus Status { get; set; }
    }
}