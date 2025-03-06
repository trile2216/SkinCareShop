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
    public class ProductSkinTypeRepository : IProductSkinTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductSkinTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ProductSkinType> AddProductSkinTypeAsync(ProductSkinType productSkinType)
        {
            await _context.ProductSkinTypes.AddAsync(productSkinType);
            await _context.SaveChangesAsync();
            return productSkinType;
        }

        public async Task<List<ProductSkinType>> GetProductSkinTypesAsync(int productId)
        {
            return await _context.ProductSkinTypes
            .Where(p => p.ProductId == productId)
            .ToListAsync();
        }

        public async Task<List<ProductSkinType>> UpdateProductSkinTypesAsync(int productId, List<ProductSkinType> newProductSkinTypes)
        {
            var existingProductSkinTypes = await GetProductSkinTypesAsync(productId);

            var recordsToUpdate = new List<ProductSkinType>();

            foreach (var newProductSkinType in newProductSkinTypes)
            {
                var existingProductSkinType = existingProductSkinTypes.FirstOrDefault(p => p.Id == newProductSkinType.Id);
                if (existingProductSkinType != null)
                {
                    existingProductSkinType.SkinTypeId = newProductSkinType.SkinTypeId;
                    existingProductSkinType.RecommentedLevel = newProductSkinType.RecommentedLevel;
                    recordsToUpdate.Add(existingProductSkinType);
                }
                else
                {
                    await _context.ProductSkinTypes.AddAsync(newProductSkinType);
                }
            }

            var idsToKeep = newProductSkinTypes.Select(p => p.Id).ToList();
            var recordsToDelete = existingProductSkinTypes.Where(p => !idsToKeep.Contains(p.Id)).ToList();
            if (recordsToDelete.Any())
            {
                _context.ProductSkinTypes.RemoveRange(recordsToDelete);
            }

            await _context.SaveChangesAsync();

            return await _context.ProductSkinTypes
                .Where(p => p.ProductId == productId)
                .ToListAsync();
        }

        public async Task<List<ProductSkinType>> DeleteProductSkinTypeByProductId(int productId)
        {
            var productSkinTypes = await GetProductSkinTypesAsync(productId);

            if (productSkinTypes.Any())
            {
                _context.ProductSkinTypes.RemoveRange(productSkinTypes);
                await _context.SaveChangesAsync();
            }

            return productSkinTypes;
        }

    }
}