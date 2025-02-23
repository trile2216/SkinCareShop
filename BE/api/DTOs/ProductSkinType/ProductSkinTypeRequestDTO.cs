using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ProductSkinType
{
    public class ProductSkinTypeRequestDTO
    {
        [Required]
        public int SkinTypeId { get; set; }

        [Required]
        [Range(3, 5)]
        public int RecommentedLevel { get; set; }
    }
}