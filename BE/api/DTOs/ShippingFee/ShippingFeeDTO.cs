using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ShippingFee
{
    public class ShippingFeeDTO
    {
        public int Id { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public string CityName { get; set; }
        public string DistrictName { get; set; }
        public decimal Fee { get; set; }
        public bool IsActive { get; set; }
        public string LastUpdated { get; set; }
    }
}
