using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ShippingFee
{
    public class DefaultFeeDTO
    {
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public decimal Fee { get; set; }

    }
}