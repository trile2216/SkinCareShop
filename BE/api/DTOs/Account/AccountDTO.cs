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
        public string UserName { get; set; } = null!;

        public UserRole Role { get; set; }

        public bool IsActive { get; set; }

        public virtual Customer? Customer { get; set; }
    }
}