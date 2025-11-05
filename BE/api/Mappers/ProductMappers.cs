using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Cart;
using api.DTOs.Products;
using api.Models;
using OfficeOpenXml.FormulaParsing.ExpressionGraph;

namespace api.Mappers
{
    public static class ProductMappers
    {
        public static ProductDTO ToProductDTO(this Product product)
        {
            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Ingredient = product.Ingredient,
                Image = product.Image,
                Gender = product.Gender.ToString(),
                Stock = product.Stock,
                Description = product.Description,
                BrandName = product.Brand?.Name ?? string.Empty,
                CategoryName = product.Category?.Name ?? string.Empty,
                BrandId = product.BrandId,
                CategoryId = product.CategoryId,
                Sale = product.Sale,
                Price = product.Price,
                ProductSkinTypes = product.ProductSkinTypes.Select(x => x.ToProductSkinTypeDTO()).ToList(),
                Comments = product.Comments.Select(x => x.ToCommentDTO()).ToList(),
                Status = product.Status,
            };
        }

        public static Product ToProductFromCreateDTO(this CreateProductDTO createProductDTO)
        {
            return new Product
            {
                Name = createProductDTO.Name,
                Ingredient = createProductDTO.Ingredient,
                Image = createProductDTO.Image,
                Gender = createProductDTO.Gender,
                Stock = createProductDTO.Stock,
                Description = createProductDTO.Description,
                CategoryId = createProductDTO.CategoryId,
                BrandId = createProductDTO.BrandId,
                Sale = createProductDTO.Sale,
                Price = createProductDTO.Price,
                Status = true,
            };
        }

        public static Product ToProductFromUpdateDTO(this UpdateProductDTO updateProductDTO)
        {
            return new Product
            {
                Name = updateProductDTO.Name,
                Ingredient = updateProductDTO.Ingredient,
                Image = updateProductDTO.Image,
                Gender = updateProductDTO.Gender,
                Stock = updateProductDTO.Stock,
                Description = updateProductDTO.Description,
                CategoryId = updateProductDTO.CategoryId,
                BrandId = updateProductDTO.BrandId,
                Sale = updateProductDTO.Sale,
                Price = updateProductDTO.Price,
                Status = updateProductDTO.Status,
            };
        }

        public static CartItem ToCartItem(this Product product)
        {
            return new CartItem
            {
                ProductId = product.Id,
                ProductImage = product.Image,
                ProductName = product.Name,
                ProductPrice = product.Price,
                ProductSale = product.Sale,
            };
        }

    }
}