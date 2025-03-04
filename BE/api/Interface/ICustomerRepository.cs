using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ICustomerRepository
    {
        Task<List<Customer>> GetAllCustomerAsync();

        Task<Customer?> GetCustomerByIdAsync(int id);

        Task<Customer?> CreateCustomerAsync(Customer customer);

        Task<Customer?> UpdateCustomerAsync(int id, Customer customer);

        Task<Customer?> DeleteCustomerAsync(int id);


    }
}