using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Account;
using api.DTOs.Order;
using api.DTOs.Quiz;

namespace api.DTOs.Customer
{
    public class CustomerDTO
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public bool IsActive { get; set; }

    }
}