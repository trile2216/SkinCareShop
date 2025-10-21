using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Customer;
using api.Constant;
using api.Models;

namespace api.DTOs.Account
{
    public class AccountDTO
    {
        public string Id { get; set; }

        public string UserName { get; set; } = null!;

        public string Role { get; set; } = String.Empty;

        public bool IsActive { get; set; }

        public virtual api.Models.Customer? Customer { get; set; } // chỉnh lại thành customer DTO     
    }
}