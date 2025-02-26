using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using api.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace api.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;
        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProductAsync()
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Comments)
                .Include(p => p.ProductSkinTypes)
                .Where(p => p.Status == true)
                .ToListAsync();
        }


        public Task<Product?> GetProductByIdAsync(int id)
        {
            return _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Comments)
                .Include(p => p.ProductSkinTypes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }


        public async Task<Product?> UpdateProductAsync(int id, Product newProduct)
        {
            var existingProduct = await GetProductByIdAsync(id);
            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.Name = newProduct.Name;
            existingProduct.Price = newProduct.Price;
            existingProduct.Description = newProduct.Description;
            existingProduct.Image = newProduct.Image;
            existingProduct.Stock = newProduct.Stock;
            existingProduct.Gender = newProduct.Gender;
            existingProduct.Ingredient = newProduct.Ingredient;
            existingProduct.CategoryId = newProduct.CategoryId;
            existingProduct.BrandId = newProduct.BrandId;
            existingProduct.Sale = newProduct.Sale;
            existingProduct.Status = newProduct.Status;

            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<Product?> DeleteProductAsync(int id)
        {
            var existingProduct = await GetProductByIdAsync(id);
            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.Status = false;
            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<List<Product>> GetProductByCategoryIdAsync(int id)
        {
            var products = await _context.Products.Where(p => p.CategoryId == id).ToListAsync();
            return products;
        }

        public async Task<List<Product>> GetProductByBrandIdAsync(int id)
        {
            var products = await _context.Products.Where(p => p.BrandId == id).ToListAsync();
            return products;
        }

        public async Task<Product?> UpdateProductQuantityAfterOrderAsync(int id, int quantity)
        {
            var existingProduct = await GetProductByIdAsync(id);
            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.Stock -= quantity;

            await _context.SaveChangesAsync();
            return existingProduct;
        }
    }
}