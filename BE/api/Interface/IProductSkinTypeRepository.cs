using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IProductSkinTypeRepository
    {
        Task<ProductSkinType> AddProductSkinTypeAsync(ProductSkinType productSkinType);

        Task<List<ProductSkinType>> UpdateProductSkinTypesAsync(int productId, List<ProductSkinType> productSkinTypes);

        Task<List<ProductSkinType>> GetProductSkinTypesAsync(int productId);

        Task<List<ProductSkinType>> DeleteProductSkinTypeByProductId(int productId);

    }
}