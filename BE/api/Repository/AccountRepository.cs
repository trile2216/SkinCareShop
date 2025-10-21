using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _context;

        public AccountRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Account>> GetAllAccountAsync()
        {
            return await _context.Accounts
                .Include(a => a.Customer)
                .ToListAsync();
        }

        public async Task<Account?> GetAccountByIdAsync(string id)
        {

            return await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Account> CreateAccountAsync(Account account)
        {
            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();
            return account;
        }

        public async Task<Account?> UpdateAccountAsync(string id, Account account)
        {
            var existingAccount = await GetAccountByIdAsync(id);
            if (existingAccount == null)
            {
                return null;
            }

            existingAccount.PasswordHash = account.PasswordHash;

            await _context.SaveChangesAsync();
            return existingAccount;

        }

        public async Task<Account?> DeleteAccountAsync(string id)
        {
            var account = await GetAccountByIdAsync(id);

            if (account == null)
            {
                return null;
            }

            account.IsActive = false;
            await _context.SaveChangesAsync();

            return account;
        }
    }
}