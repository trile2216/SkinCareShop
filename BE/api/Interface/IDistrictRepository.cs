using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IDistrictRepository
    {
        Task<List<District>> GetAllDistrictsAsync();
        Task<District?> GetDistrictByIdAsync(int id);
        Task<List<District>?> GetDistrictByCityIdAsync(int cityId);
    }
}