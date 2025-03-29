using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ShippingFee
{
    public class CreateShippingFeeDTO
    {
        [Required]
        public int CityId { get; set; }

        [Required]
        public int DistrictId { get; set; }

        [Required]
        [Range(0, 10000000)]
        public decimal Fee { get; set; }
    }
}