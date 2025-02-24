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
                Id = account.Id,
                UserName = account.UserName,
                Role = account.Role.ToString(),
                IsActive = account.IsActive,
                Customer = account.Customer
            };
        }

        public static Account ToAccountFromCreateDTO(this CreateAccountDTO createAccountDTO, string userId)
        {
            return new Account
            {
                UserName = createAccountDTO.UserName,
                Role = createAccountDTO.Role,
                IsActive = true,
                Password = createAccountDTO.Password,
                IdentityUserId = userId
            };
        }
    }
}