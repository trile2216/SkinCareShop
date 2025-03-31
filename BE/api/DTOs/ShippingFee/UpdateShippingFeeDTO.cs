using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ShippingFee
{
    public class UpdateShippingFeeDTO
    {
        [Required]
        [Range(0, 10000000)]
        public decimal Fee { get; set; }

    }
}