using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml.Packaging.Ionic.Zip;

namespace api.Repository
{
    public class ShippingFeeRepository : IShippingFeeRepository
    {
        private readonly ApplicationDbContext _context;
        public ShippingFeeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ShippingFee> CreateShippingFeeAsync(ShippingFee shippingFee)
        {
            await _context.ShippingFees.AddAsync(shippingFee);
            await _context.SaveChangesAsync();
            return shippingFee;
        }

        public async Task<List<ShippingFee>> GetAllShippingFeesAsync()
        {
            return await _context.ShippingFees
                .Include(sf => sf.City)
                .Include(sf => sf.District)
                .ToListAsync();

        }

        public async Task<ShippingFee?> GetActiveShippingFeeByCityAndDistrictAsync(int cityId, int districtId)
        {
            return await _context.ShippingFees
                 .Where(sf => sf.CityId == cityId && sf.DistrictId == districtId && sf.IsActive)
                 .FirstOrDefaultAsync();

        }

        public async Task<ShippingFee?> GetShippingFeeByIdAsync(int id)
        {
            return await _context.ShippingFees
                .Where(sf => sf.Id == id)
                .Include(sf => sf.City)
                .Include(sf => sf.District)
                .FirstOrDefaultAsync();
        }

        public async Task<ShippingFee?> UpdateShippingFeeAsync(int id, ShippingFee shippingFee)
        {
            var existingShippingFee = await GetShippingFeeByIdAsync(id);

            if (existingShippingFee == null)
            {
                return null;
            }

            existingShippingFee.Fee = shippingFee.Fee;
            existingShippingFee.LastUpdated = DateTime.UtcNow;


            _context.ShippingFees.Update(existingShippingFee);
            await _context.SaveChangesAsync();
            return existingShippingFee;
        }

        public async Task<ShippingFee?> ChangeStatus(int id, bool isActive)
        {
            var shippingFee = await GetShippingFeeByIdAsync(id);

            if (shippingFee == null)
            {
                return null;
            }

            shippingFee.IsActive = isActive;
            shippingFee.LastUpdated = DateTime.UtcNow;

            _context.ShippingFees.Update(shippingFee);
            await _context.SaveChangesAsync();
            return shippingFee;

        }
    }
}