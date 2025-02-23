using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);

        Task<Category> AddCategoryAsync(Category category);

        Task<Category?> UpdateCategoryAsync(int id, Category newCategory);

        Task<Category?> DeleteCategoryAsync(int id);
    }
}