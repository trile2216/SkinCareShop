using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Customer;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/customer")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepo;

        public CustomerController(ICustomerRepository customerRepo)
        {
            _customerRepo = customerRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCustomerAsync()
        {
            var customers = await _customerRepo.GetAllCustomerAsync();

            if (customers == null)
            {
                return NotFound();
            }

            var customerDTO = customers.Select(c => c.ToCustomerDTO());
            return Ok(customers);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetCustomerByIdAsync(int id)
        {
            var customer = await _customerRepo.GetCustomerByIdAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDTO = customer.ToCustomerDTO();
            return Ok(customerDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateCustomerAsync(int id, [FromBody] UpdateCustomerDTO customerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var customer = customerDTO.ToCustomerFromUpdateDTO();


            await _customerRepo.UpdateCustomerAsync(id, customer);
            return Ok();
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteCustomerAsync(int id)
        {
            await _customerRepo.DeleteCustomerAsync(id);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] CreateCustomerDTO customerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var customer = customerDTO.ToCustomerFromCreateDTO();

            await _customerRepo.CreateCustomerAsync(customer);
            return CreatedAtAction(nameof(GetCustomerByIdAsync), new { id = customer.Id }, customer);
        }
    }
}