using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Customer;
using api.Models;

namespace api.Mappers
{
    public static class CustomerMapper
    {
        public static CustomerDTO ToCustomerDTO(this Customer customer)
        {
            return new CustomerDTO
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
                IsActive = customer.Account.IsActive
            };
        }

        public static Customer ToCustomerFromUpdateDTO(this UpdateCustomerDTO customerDTO)
        {
            return new Customer
            {
                FirstName = customerDTO.FirstName,
                LastName = customerDTO.LastName,
                Email = customerDTO.Email,
                Phone = customerDTO.Phone,
                Address = customerDTO.Address
            };
        }

        public static Customer ToCustomerFromCreateDTO(this CreateCustomerDTO customerDTO)
        {
            return new Customer
            {
                FirstName = customerDTO.FirstName,
                LastName = customerDTO.LastName,
                Email = customerDTO.Email,
                Phone = customerDTO.Phone,
                Address = customerDTO.Address
            };
        }
    }
}