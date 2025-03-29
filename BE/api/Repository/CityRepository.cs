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
    public class CityRepository : ICityRepository
    {

        private readonly ApplicationDbContext _context;
        public CityRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<City>> GetAllCitiesAsync()
        {
            return await _context.Cities.ToListAsync();
        }

        public async Task<City?> GetCityByIdAsync(int id)
        {
            return await _context.Cities
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();
        }
    }
}