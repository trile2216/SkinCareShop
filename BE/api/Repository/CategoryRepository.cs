using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }



        public async Task<Category> AddCategory(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> DeleteCategory(int id)
        {
            var existingCategory = await GetCategoryById(id);
            if (existingCategory == null)
            {
                return null;
            }

            existingCategory.Status = false;

            _context.Categories.Update(existingCategory);
            await _context.SaveChangesAsync();
            return existingCategory;
        }

        public async Task<List<Category>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetCategoryById(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Category?> UpdateCategory(int id, Category newCategory)
        {
            var existingCategory = await GetCategoryById(id);
            if (existingCategory == null)
            {
                return null;
            }

            existingCategory.Name = newCategory.Name;
            existingCategory.Description = newCategory.Description;

            await _context.SaveChangesAsync();
            return existingCategory;
        }
    }
}