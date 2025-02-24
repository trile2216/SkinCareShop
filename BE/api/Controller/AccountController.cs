using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.Account;
using api.Interface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly IAccountRepository _accountRepo;

        public AccountController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IAccountRepository accountRepo)
        {
            _context = context;
            _userManager = userManager;
            _accountRepo = accountRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAccount()
        {

            var accounts = await _accountRepo.GetAllAccountAsync();

            if (accounts.Count == 0)
            {
                return NotFound();
            }

            var accountDTOs = accounts.Select(a => a.ToAccountDTO());

            return Ok(accountDTOs);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var account = await _accountRepo.GetAccountByIdAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            return Ok(account.ToAccountDTO());
        }


        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDTO createAccountDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = createAccountDTO.UserName
            };

            var result = await _userManager.CreateAsync(user, createAccountDTO.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var account = createAccountDTO.ToAccountFromCreateDTO(user.Id);

            await _accountRepo.CreateAccountAsync(account);
            return CreatedAtAction(nameof(GetAccountById), new { id = account.Id }, account.ToAccountDTO());
        }
    }
}

