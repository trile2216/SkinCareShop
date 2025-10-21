using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.Products;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepo;

        private readonly IProductSkinTypeRepository _productSkinTypeRepo;

        public ProductController(IProductSkinTypeRepository productSkinTypeRepo, IProductRepository productRepo)
        {
            _productRepo = productRepo;
            _productSkinTypeRepo = productSkinTypeRepo;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productRepo.GetAllProductAsync();

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

            var product = await _productRepo.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound("Product not found");
            }

            return Ok(product.ToProductDTO());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepo.CreateProductAsync(productDTO.ToProductFromCreateDTO());

            foreach (var productSkinTypeDTO in productDTO.ProductSkinTypes)
            {
                var productSkinType = productSkinTypeDTO.ToProductSkinTypeFromRequestDTO(product.Id);
                await _productSkinTypeRepo.AddProductSkinTypeAsync(productSkinType);
            }

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product.ToProductDTO());
        }

        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepo.UpdateProductAsync(id, productDTO.ToProductFromUpdateDTO());

            if (product == null)
            {
                return NotFound("Product not found");
            }

            var productSkinTypes = productDTO.ProductSkinTypes.Select(p => p.ToProductSkinTypeFromRequestDTO(id)).ToList();

            await _productSkinTypeRepo.UpdateProductSkinTypesAsync(product.Id, productSkinTypes);

            return Ok(product.ToProductDTO());
        }

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productSkinTypeRepo.DeleteProductSkinTypeByProductId(id);
            var product = await _productRepo.DeleteProductAsync(id);

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

            var products = await _productRepo.GetProductByCategoryIdAsync(categoryId);
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

            var products = await _productRepo.GetProductByBrandIdAsync(brandId);

            if (products.Count == 0)
            {
                return NotFound("No products found");
            }
            return Ok(products.Select(p => p.ToProductDTO()));
        }

        [HttpGet]
        [Route("recommendation/{skinTypeId:int}&{categoryId:int}")]
        public async Task<IActionResult> GetRecommendationProducts([FromRoute] int categoryId, int skinTypeId)
        {
            var products = await _productRepo.GetRecommendProductsByCateAndSkinType(categoryId, skinTypeId);

            if (products.Count == 0)
            {
                return NotFound("No products found");
            }

            var productDTOs = products.Select(p => p.ToProductDTO());

            return Ok(productDTOs);
        }
    }
}