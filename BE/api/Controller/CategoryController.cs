using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Categories;
using api.Interface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/category")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;

        public CategoryController(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryRepo.GetCategoriesAsync();
            if (categories.Count == 0)
            {
                return NotFound("No categories found");
            }
            var categoryDTOs = categories.Select(x => x.ToCategoryDTO());
            return Ok(categoryDTOs);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await _categoryRepo.GetCategoryByIdAsync(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }
            return Ok(category.ToCategoryDTO());
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] CreateCategoryDTO categoryDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var category = categoryDTO.ToCategoryFromCreateDTO();
            var newCategory = await _categoryRepo.AddCategoryAsync(category);

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category.ToCategoryDTO());
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDTO updateCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var category = updateCategory.ToCategoryFromUpdateDTO();
            var updatedCategory = await _categoryRepo.UpdateCategoryAsync(id, category);

            if (updatedCategory == null)
            {
                return NotFound("Product not found");
            }
            return Ok(updatedCategory.ToCategoryDTO());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result = await _categoryRepo.DeleteCategoryAsync(id);
            if (result == null)
            {
                return NotFound("Product not found");
            }
            return Ok(result.ToCategoryDTO());
        }

    }
}