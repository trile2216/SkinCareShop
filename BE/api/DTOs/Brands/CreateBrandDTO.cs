using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Brands
{
    public class CreateBrandDTO
    {
        [Required]
        public string Name { get; set; } = null!;

    }
}