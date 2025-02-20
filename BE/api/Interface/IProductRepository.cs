using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IProductRepository
    {

        Task<List<Product>> GetAllAsync();

        Task<Product?> GetByIdAsync(int id);

        Task<Product> CreateAsync(Product product);

        Task<Product?> UpdateAsync(int id, Product newProduct);

        Task<Product?> DeleteAsync(int id);

        Task<List<Product>> GetByCategoryIdAsync(int id);

        Task<List<Product>> GetByBrandIdAsync(int id);

    }
}