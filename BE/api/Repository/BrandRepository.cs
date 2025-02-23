using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class BrandRepository : IBrandRepository
    {
        private readonly ApplicationDbContext _context;

        public BrandRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Brand> AddBrandAsync(Brand brand)
        {
            await _context.Brands.AddAsync(brand);
            await _context.SaveChangesAsync();
            return brand;
        }

        public async Task<Brand?> DeleteBrandAsync(int id)
        {
            var existingBrand = await GetBrandByIdAsync(id);
            if (existingBrand == null)
            {
                return null;
            }

            existingBrand.Status = false;

            _context.Brands.Update(existingBrand);
            await _context.SaveChangesAsync();
            return existingBrand;
        }

        public async Task<Brand?> GetBrandByIdAsync(int id)
        {
            var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Id == id);

            if (brand == null)
            {
                return null;
            }
            return brand;
        }

        public async Task<List<Brand>> GetBrandsAsync()
        {
            return await _context.Brands.ToListAsync();
        }

        public async Task<Brand?> UpdateBrandAsync(int id, Brand newBrand)
        {
            var existingBrand = await GetBrandByIdAsync(id);

            if (existingBrand == null)
            {
                return null;
            }

            existingBrand.Name = newBrand.Name;
            existingBrand.Status = newBrand.Status;

            await _context.SaveChangesAsync();
            return existingBrand;
        }
    }
}