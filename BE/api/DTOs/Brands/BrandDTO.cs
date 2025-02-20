using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Brands
{
    public class BrandDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public bool Status { get; set; }
    }
}