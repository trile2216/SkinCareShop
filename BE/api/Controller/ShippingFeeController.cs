using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.ShippingFee;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/shipping-fee")]
    public class ShippingFeeController : ControllerBase
    {
        private readonly IShippingFeeRepository _shippingFeeRepository;

        private readonly ICityRepository _cityRepository;
        private readonly IDistrictRepository _districtRepository;
        public ShippingFeeController(IShippingFeeRepository shippingFeeRepository, ICityRepository cityRepository, IDistrictRepository districtRepository)
        {
            _shippingFeeRepository = shippingFeeRepository;
            _cityRepository = cityRepository;
            _districtRepository = districtRepository;
        }

        [HttpGet]
        [Route("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllShippingFees()
        {
            var shippingFees = await _shippingFeeRepository.GetAllShippingFeesAsync();

            if (shippingFees.Count == 0)
            {
                return NotFound("No shipping fees found.");
            }

            var shippingFeeDTOs = shippingFees.Select(sf => sf.ToShippingFeeDTO()).ToList();

            return Ok(shippingFeeDTOs);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetShippingFeeById(int id)
        {
            var shippingFee = await _shippingFeeRepository.GetShippingFeeByIdAsync(id);

            if (shippingFee == null)
            {
                return NotFound($"Shipping fee with ID {id} not found.");
            }

            var shippingFeeDTO = shippingFee.ToShippingFeeDTO();

            return Ok(shippingFeeDTO);
        }

        [HttpGet]
        [Route("{cityId}&{districtId}")]
        public async Task<IActionResult> GetShippingFeesByCityId([FromRoute] int cityId, [FromRoute] int districtId)
        {
            var shippingFee = await _shippingFeeRepository.GetActiveShippingFeeByCityAndDistrictAsync(cityId, districtId);

            if (shippingFee == null)
            {
                var defaultFeeDTO = new DefaultFeeDTO
                {
                    CityId = cityId,
                    DistrictId = districtId,
                    Fee = 15.000M,
                };
                return Ok(defaultFeeDTO);
            }


            var shippingFeeDTO = shippingFee.ToShippingFeeDTO();

            return Ok(shippingFeeDTO);
        }

        [HttpGet]
        [Route("cities")]
        public async Task<IActionResult> GetAllCities()
        {
            var cities = await _cityRepository.GetAllCitiesAsync();

            if (cities.Count == 0)
            {
                return NotFound("No cities found.");
            }

            return Ok(cities);
        }

        [HttpGet]
        [Route("districts-by-city/{cityId}")]
        public async Task<IActionResult> GetDistrictsByCityId(int cityId)
        {
            var districts = await _districtRepository.GetDistrictByCityIdAsync(cityId);

            if (districts == null || districts.Count == 0)
            {
                return NotFound($"No districts found for city ID {cityId}.");
            }

            return Ok(districts);
        }

        [HttpGet]
        [Route("district-by-id/{districtId}")]
        public async Task<IActionResult> GetDistrictById(int districtId)
        {
            var district = await _districtRepository.GetDistrictByIdAsync(districtId);

            if (district == null)
            {
                return NotFound($"No district found for ID {districtId}.");
            }

            return Ok(district);
        }

        [HttpPost]
        [Route("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateShippingFee([FromBody] CreateShippingFeeDTO createShippingFeeDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var shippingFee = createShippingFeeDTO.ToShippingFeeFromCreateDTO();

            await _shippingFeeRepository.CreateShippingFeeAsync(shippingFee);

            return CreatedAtAction(nameof(GetShippingFeeById), new { id = shippingFee.Id }, shippingFee);
        }

        [HttpPut]
        [Route("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateShippingFee([FromRoute] int id, [FromBody] UpdateShippingFeeDTO updateShippingFeeDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var shippingFee = updateShippingFeeDTO.ToShippingFeeFromUpdateDTO();

            var updatedShippingFee = await _shippingFeeRepository.UpdateShippingFeeAsync(id, shippingFee);

            if (updatedShippingFee == null)
            {
                return NotFound($"Shipping fee with ID {id} not found.");
            }

            return Ok(updatedShippingFee.ToShippingFeeDTO());
        }


        [HttpDelete]
        [Route("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteShippingFee([FromRoute] int id)
        {
            var shippingFee = await _shippingFeeRepository.DeleteShippingFeeAsync(id);

            if (shippingFee == null)
            {
                return NotFound($"Shipping fee with ID {id} not found.");
            }

            var shippingFeeDTO = shippingFee.ToShippingFeeDTO();

            return Ok(shippingFeeDTO);
        }
    }
}