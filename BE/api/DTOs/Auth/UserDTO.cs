using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Auth
{
    public class UserDTO
    {
        public string Role { get; set; } = string.Empty;

        public string Token { get; set; } = string.Empty;


    }
}