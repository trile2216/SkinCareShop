using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.SkinType;
using api.Models;

namespace api.Mappers
{
    public static class SkinTypeMappers
    {
        public static ProductSkinTypeDTO ToProductSkinTypeDTO(this ProductSkinType productSkinType)
        {
            return new ProductSkinTypeDTO
            {
                Id = productSkinType.Id,
                ProductId = productSkinType.ProductId,
                SkinTypeId = productSkinType.SkinTypeId,
                RecommentedLevel = productSkinType.RecommentedLevel,
            };
        }

        public static ProductSkinType ToProductSkinTypeFromRequestDTO(this ProductSkinTypeRequestDTO productSkinTypeRequestDTO, int productId)
        {
            return new ProductSkinType
            {
                ProductId = productId,
                SkinTypeId = productSkinTypeRequestDTO.SkinTypeId,
                RecommentedLevel = productSkinTypeRequestDTO.RecommentedLevel,
            };
        }

        public static ProductSkinType ToProductSkinTypeFromDTO(this ProductSkinTypeDTO productSkinTypeDTO, int productId)
        {
            return new ProductSkinType
            {
                Id = productSkinTypeDTO.Id,
                ProductId = productSkinTypeDTO.ProductId,
                SkinTypeId = productSkinTypeDTO.SkinTypeId,
                RecommentedLevel = productSkinTypeDTO.RecommentedLevel,
            };
        }

        public static SkinTypeDTO ToSkinTypeDTO(this SkinType skinType)
        {
            return new SkinTypeDTO
            {
                Name = skinType.Name,
                Symbol = skinType.Symbol,
                Characteristics = skinType.Characteristics,
            };
        }
    }
}