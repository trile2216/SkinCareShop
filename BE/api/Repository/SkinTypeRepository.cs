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
    public class SkinTypeRepository : ISkinTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public SkinTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SkinType?> CreateSkinTypeAsync(SkinType skinType)
        {
            await _context.SkinTypes.AddAsync(skinType);
            await _context.SaveChangesAsync();
            return skinType;
        }

        public async Task<SkinType?> DeleteSkinTypeAsync(int id)
        {
            var product = await GetSkinTypeByIdAsync(id);

            if (product == null)
            {
                return null;
            }

            _context.SkinTypes.Remove(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<List<SkinType>> GetAllSkinTypeAsync()
        {
            return await _context.SkinTypes.ToListAsync();
        }

        public async Task<SkinType?> GetSkinTypeByIdAsync(int id)
        {
            return await _context.SkinTypes.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<SkinType?> GetSkinTypeBySymbolAsync(string symbol)
        {
            return await _context.SkinTypes.FirstOrDefaultAsync(x => x.Symbol == symbol);
        }

        public async Task<SkinType?> UpdateSkinTypeAsync(int id, SkinType skinType)
        {
            var existingSkinType = await GetSkinTypeByIdAsync(id);

            if (existingSkinType == null)
            {
                return null;
            }

            existingSkinType.Name = skinType.Name;
            existingSkinType.Symbol = skinType.Symbol;
            existingSkinType.Characteristics = skinType.Characteristics;

            await _context.SaveChangesAsync();
            return skinType;
        }
    }
}