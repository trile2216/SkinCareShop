using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IBrandRepository
    {
        Task<List<Brand>> GetBrandsAsync();
        Task<Brand?> GetBrandByIdAsync(int id);

        Task<Brand> AddBrandAsync(Brand brand);

        Task<Brand?> UpdateBrandAsync(int id, Brand newBrand);

        Task<Brand?> DeleteBrandAsync(int id);
    }
}