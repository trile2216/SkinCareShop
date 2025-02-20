using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Brands;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace api.Controller
{
    [ApiController]
    [Route("api/brand")]
    public class BrandController : ControllerBase
    {
        private readonly IBrandRepository _brandRepo;

        public BrandController(IBrandRepository brandRepo)
        {
            _brandRepo = brandRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await _brandRepo.GetBrandsAsync();
            var brandDTOs = brands.Select(b => b.ToBrandDTO());
            return Ok(brandDTOs);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetBrandById(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var brand = await _brandRepo.GetBrandByIdAsync(id);

            if (brand == null)
            {
                return NotFound();
            }

            return Ok(brand.ToBrandDTO());
        }

        [HttpPost]
        public async Task<IActionResult> CreateBrand([FromBody] CreateBrandDTO createBrandDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var brand = createBrandDTO.ToBrandFromCreateDTO();
            var newBrand = await _brandRepo.AddBrandAsync(brand);

            return CreatedAtAction(nameof(GetBrandById), new { id = newBrand.Id }, newBrand.ToBrandDTO());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateBrand(int id, [FromBody] UpdateBrandDTO updateBrandDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var brand = updateBrandDTO.ToBrandFromUpdateDTO();
            var updatedBrand = await _brandRepo.UpdateBrandAsync(id, brand);

            if (updatedBrand == null)
            {
                return NotFound();
            }

            return Ok(updatedBrand.ToBrandDTO());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var deletedBrand = await _brandRepo.DeleteBrandAsync(id);

            if (deletedBrand == null)
            {
                return NotFound();
            }

            return Ok(deletedBrand.ToBrandDTO());
        }
    }
}