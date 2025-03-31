using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IShippingFeeRepository
    {
        Task<List<ShippingFee>> GetAllShippingFeesAsync();
        Task<ShippingFee?> GetShippingFeeByIdAsync(int id);
        Task<ShippingFee?> GetActiveShippingFeeByCityAndDistrictAsync(int cityId, int districtId);
        Task<ShippingFee> CreateShippingFeeAsync(ShippingFee shippingFee);
        Task<ShippingFee?> UpdateShippingFeeAsync(int id, ShippingFee shippingFee); Task<ShippingFee?> ChangeStatus(int id, bool isActive);
        Task<ShippingFee?> DeleteShippingFeeAsync(int id);
    }
}