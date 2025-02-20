using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Categories;
using api.Models;

namespace api.Mappers
{
    public static class CategoryMappers
    {
        public static CategoryDTO ToCategoryDTO(this Category category)
        {
            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
            };
        }

        public static Category ToCategoryFromCreateDTO(this CreateCategoryDTO categoryDTO)
        {
            return new Category
            {
                Name = categoryDTO.Name,
                Description = categoryDTO.Description,
            };
        }

        public static Category ToCategoryFromUpdateDTO(this UpdateCategoryDTO categoryDTO)
        {
            return new Category
            {
                Name = categoryDTO.Name,
                Description = categoryDTO.Description,
                Status = categoryDTO.Status,
            };
        }
    }
}