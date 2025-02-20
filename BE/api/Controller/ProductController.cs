using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.Products;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepo;

        public ProductController(ApplicationDbContext context, IProductRepository productRepo)
        {
            _productRepo = productRepo;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productRepo.GetAllAsync();

            if (products.Count == 0)
            {
                return NotFound("No products found");
            }

            var productDTOs = products.Select(p => p.ToProductDTO());

            return Ok(productDTOs);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepo.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound("Product not found");
            }

            return Ok(product.ToProductDTO());
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = productDTO.ToProductFromCreateDTO();

            await _productRepo.CreateAsync(product);

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product.ToProductDTO());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepo.UpdateAsync(id, productDTO.ToProductFromUpdateDTO());

            if (product == null)
            {
                return NotFound("Product not found");
            }

            return Ok(product.ToProductDTO());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepo.DeleteAsync(id);

            if (product == null)
            {
                return NotFound("Product not found");
            }

            return Ok(product.ToProductDTO());
        }

        [HttpGet]
        [Route("category/{categoryId:int}")]
        public async Task<IActionResult> GetProductsByCategory(int categoryId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var products = await _productRepo.GetByCategoryIdAsync(categoryId);
            if (products.Count == 0)
            {
                return NotFound("No products found");
            }
            return Ok(products.Select(p => p.ToProductDTO()));
        }

        [HttpGet]
        [Route("brand/{brandId:int}")]
        public async Task<IActionResult> GetProductsByBrand(int brandId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var products = await _productRepo.GetByBrandIdAsync(brandId);

            if (products.Count == 0)
            {
                return NotFound("No products found");
            }
            return Ok(products.Select(p => p.ToProductDTO()));
        }
    }
}