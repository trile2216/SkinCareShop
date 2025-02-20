using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Brands;
using api.Models;

namespace api.Mappers
{
    public static class BrandMappers
    {
        public static BrandDTO ToBrandDTO(this Brand brand)
        {
            return new BrandDTO
            {
                Id = brand.Id,
                Name = brand.Name,
            };
        }

        public static Brand ToBrandFromCreateDTO(this CreateBrandDTO createBrandDTO)
        {
            return new Brand
            {
                Name = createBrandDTO.Name,
            };
        }

        public static Brand ToBrandFromUpdateDTO(this UpdateBrandDTO updateBrandDTO)
        {
            return new Brand
            {
                Name = updateBrandDTO.Name,
                Status = updateBrandDTO.Status,
            };
        }
    }
}