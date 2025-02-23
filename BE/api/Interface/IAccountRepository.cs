using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IAccountRepository
    {
        Task<List<Account>> GetAllAccountAsync();

        Task<Account?> GetAccountByIdAsync(int id);

        Task<Account> CreateAccountAsync(Account account);

        Task<Account?> UpdateAccountAsync(int id, Account account);

        Task<Account?> DeleteAccountAsync(int id);

    }
}