using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Enum;
using api.Models;

namespace api.DTOs.Account
{
    public class AccountDTO
    {
        public int Id { get; set; }

        public string UserName { get; set; } = null!;

        public string Role { get; set; } = String.Empty;

        public bool IsActive { get; set; }

        public virtual Customer? Customer { get; set; }
    }
}