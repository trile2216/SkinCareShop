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
            // Lấy danh sách các ProductSkinType hiện tại
            var existingProductSkinTypes = await GetProductSkinTypesAsync(productId);

            // Tạo danh sách các bản ghi cần cập nhật
            var recordsToUpdate = new List<ProductSkinType>();

            // Cập nhật các bản ghi đã tồn tại
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
                    // Nếu không tồn tại, thêm mới
                    await _context.ProductSkinTypes.AddAsync(newProductSkinType);
                }
            }

            // Xóa các bản ghi không còn trong danh sách mới
            var idsToKeep = newProductSkinTypes.Select(p => p.Id).ToList();
            var recordsToDelete = existingProductSkinTypes.Where(p => !idsToKeep.Contains(p.Id)).ToList();
            if (recordsToDelete.Any())
            {
                _context.ProductSkinTypes.RemoveRange(recordsToDelete);
            }

            // Lưu tất cả thay đổi một lần
            await _context.SaveChangesAsync();

            // Trả về danh sách các bản ghi đã cập nhật
            return await _context.ProductSkinTypes
                .Where(p => p.ProductId == productId)
                .ToListAsync();
        }
    }
}