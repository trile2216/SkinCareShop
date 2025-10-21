using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Account;
using api.Models;

namespace api.Interface
{
    public interface IAccountRepository
    {
        Task<List<Account>> GetAllAccountAsync();

        Task<Account?> GetAccountByIdAsync(string id);

        Task<Account> CreateAccountAsync(Account account);

        Task<Account?> UpdateAccountAsync(string id, Account account);

        Task<Account?> DeleteAccountAsync(string id);

    }
}