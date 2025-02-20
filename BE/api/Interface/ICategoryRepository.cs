using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetCategories();
        Task<Category?> GetCategoryById(int id);

        Task<Category> AddCategory(Category category);

        Task<Category?> UpdateCategory(int id, Category newCategory);

        Task<Category?> DeleteCategory(int id);
    }
}