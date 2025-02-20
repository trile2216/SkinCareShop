using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Brands
{
    public class UpdateBrandDTO
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        [DefaultValue(true)]
        public bool Status { get; set; }
    }
}