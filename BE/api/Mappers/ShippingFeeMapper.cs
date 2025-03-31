using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.ShippingFee;
using api.Models;

namespace api.Mappers
{
    public static class ShippingFeeMapper
    {
        public static ShippingFeeDTO ToShippingFeeDTO(this ShippingFee shippingFee)
        {
            return new ShippingFeeDTO()
            {
                Id = shippingFee.Id,
                CityId = shippingFee.CityId,
                DistrictId = shippingFee.DistrictId,
                CityName = shippingFee.City.Name,
                DistrictName = shippingFee.District.Name,
                Fee = shippingFee.Fee,
                IsActive = shippingFee.IsActive,
                LastUpdated = shippingFee.LastUpdated.ToString(),
            };
        }

        public static ShippingFee ToShippingFeeFromCreateDTO(this CreateShippingFeeDTO createShippingFeeDTO)
        {
            return new ShippingFee()
            {

                CityId = createShippingFeeDTO.CityId,
                DistrictId = createShippingFeeDTO.DistrictId,
                Fee = createShippingFeeDTO.Fee,
                IsActive = true,
                LastUpdated = DateTime.Now
            };
        }

        public static ShippingFee ToShippingFeeFromUpdateDTO(this UpdateShippingFeeDTO updateShippingFeeDTO)
        {
            return new ShippingFee()
            {
                Fee = updateShippingFeeDTO.Fee,
            };
        }
    }
}