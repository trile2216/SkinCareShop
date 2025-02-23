using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Account;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class AccountMappers
    {
        public static AccountDTO ToAccountDTO(this Account account)
        {
            return new AccountDTO
            {
                UserName = account.UserName,
                Role = account.Role,
                IsActive = account.IsActive,
                Customer = account.Customer
            };
        }
    }
}