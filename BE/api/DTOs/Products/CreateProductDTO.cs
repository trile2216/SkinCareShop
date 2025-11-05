using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Constant;
using api.DTOs;
using api.DTOs.SkinType;

namespace api.DTOs.Products
{
    public class CreateProductDTO
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string? Ingredient { get; set; }

        [Required]
        public string? Image { get; set; }

        [Required]
        [Range(0, 2)]
        public Gender Gender { get; set; }

        [Required]
        [Range(1, 10000)]
        public int Stock { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        [Range(1, 100)]
        public int CategoryId { get; set; }

        [Required]
        [Range(1, 100)]
        public int BrandId { get; set; }

        [Required]
        public decimal? Sale { get; set; }

        [Required]
        [Range(1, 1000000)]
        public decimal Price { get; set; }

        [Required]
        public List<ProductSkinTypeRequestDTO> ProductSkinTypes { get; set; } = new List<ProductSkinTypeRequestDTO>();

    }
}