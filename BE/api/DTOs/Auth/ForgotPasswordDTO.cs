using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Auth
{
    public class ForgotPasswordDTO
    {
        [Required]
        public string Email { get; set; }
    }
}