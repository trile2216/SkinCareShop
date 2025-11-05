using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Comments;
using api.DTOs.SkinType;
using api.Constant;
using api.Models;

namespace api.DTOs.Products
{
    public class ProductDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Ingredient { get; set; }

        public string? Image { get; set; }

        public string? Gender { get; set; }

        public int Stock { get; set; }

        public string? Description { get; set; }

        public int CategoryId { get; set; }
        
        public int BrandId { get; set; }

        public decimal? Sale { get; set; }

        public decimal Price { get; set; }

        public bool Status { get; set; }
        public string BrandName { get; set; } = null!;

        public string CategoryName { get; set; } = null!;

        public virtual List<CommentDTO> Comments { get; set; } = new List<CommentDTO>();

        public virtual List<ProductSkinTypeDTO> ProductSkinTypes { get; set; } = new List<ProductSkinTypeDTO>();
    }
}