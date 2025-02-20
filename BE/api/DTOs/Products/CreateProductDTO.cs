using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enum;

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
        [Range(1, 3)]
        public Gender Gender { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Stock { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int CategoryId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int BrandId { get; set; }

        [Required]
        public decimal? Sale { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public decimal Price { get; set; }

    }
}