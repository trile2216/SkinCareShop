using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IProductRepository
    {

        Task<List<Product>> GetAllProductAsync();

        Task<Product?> GetProductByIdAsync(int id);

        Task<Product> CreateProductAsync(Product product);

        Task<Product?> UpdateProductAsync(int id, Product newProduct);

        Task<Product?> DeleteProductAsync(int id);

        Task<List<Product>> GetProductByCategoryIdAsync(int id);

        Task<List<Product>> GetProductByBrandIdAsync(int id);

        Task<Product?> UpdateProductQuantityAfterOrderAsync(int id, int quantity);
    }
}