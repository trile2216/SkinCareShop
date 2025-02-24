using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enum;

namespace api.DTOs.Account
{
    public class CreateAccountDTO
    {
        [Required]
        public string UserName { get; set; } = null!;

        [Required]
        public UserRole Role { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
    }
}