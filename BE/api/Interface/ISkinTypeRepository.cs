using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ISkinTypeRepository
    {
        Task<List<SkinType>> GetAllSkinTypeAsync();

        Task<SkinType?> GetSkinTypeByIdAsync(int id);

        Task<SkinType?> GetSkinTypeBySymbolAsync(string symbol);

        Task<SkinType?> CreateSkinTypeAsync(SkinType skinType);

        Task<SkinType?> UpdateSkinTypeAsync(int id, SkinType skinType);

        Task<SkinType?> DeleteSkinTypeAsync(int id);
    }
}