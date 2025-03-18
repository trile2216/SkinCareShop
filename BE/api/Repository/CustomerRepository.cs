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
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _context;

        private readonly IAccountRepository _accountRepo;

        public CustomerRepository(ApplicationDbContext context, IAccountRepository accountRepo)
        {
            _context = context;
            _accountRepo = accountRepo;
        }

        public async Task<List<Customer>> GetAllCustomerAsync()
        {
            return await _context.Customers
            .Include(c => c.Account)
            .Where(c => c.Account.IsActive)
            .ToListAsync();
        }

        public async Task<Customer?> CreateCustomerAsync(Customer customer)
        {
            await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer?> DeleteCustomerAsync(int id)
        {
            var customer = await GetCustomerByIdAsync(id);

            if (customer == null)
            {
                return null;
            }

            await _accountRepo.DeleteAccountAsync(customer.AccountId);
            await _context.SaveChangesAsync();
            return customer;

        }


        public async Task<Customer?> GetCustomerByIdAsync(int id)
        {
            return await _context.Customers
                .Include(c => c.Account)
                .Where(c => c.Account.IsActive)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Customer?> UpdateCustomerAsync(int id, Customer customer)
        {
            var existingCustomer = await GetCustomerByIdAsync(id);
            if (existingCustomer == null)
            {
                return null;
            }

            existingCustomer.FirstName = customer.FirstName;
            existingCustomer.LastName = customer.LastName;
            existingCustomer.Address = customer.Address;
            existingCustomer.Phone = customer.Phone;
            existingCustomer.Email = customer.Email;

            await _context.SaveChangesAsync();
            return existingCustomer;
        }
    }
}