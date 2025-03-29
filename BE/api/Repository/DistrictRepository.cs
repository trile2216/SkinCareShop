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
    public class DistrictRepository : IDistrictRepository
    {
        private readonly ApplicationDbContext _context;
        public DistrictRepository(ApplicationDbContext context)
        {
            _context = context;
        }


        public async Task<List<District>?> GetDistrictByCityIdAsync(int cityId)
        {
            return await _context.Districts.
                Where(d => d.CityId == cityId)
                .ToListAsync();
        }


        public async Task<List<District>> GetAllDistrictsAsync()
        {
            return await _context.Districts.ToListAsync();
        }

        public Task<District?> GetDistrictByIdAsync(int id)
        {
            return _context.Districts
                .Where(d => d.Id == id)
                .FirstOrDefaultAsync();
        }
    }
}