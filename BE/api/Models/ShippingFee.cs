using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class ShippingFee
    {

        [Key]
        public int Id { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public decimal Fee { get; set; }

        public bool IsActive { get; set; }
        public DateTime LastUpdated { get; set; }
        public virtual City City { get; set; }
        public virtual District District { get; set; }
    }
}