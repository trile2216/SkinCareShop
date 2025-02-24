using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.DTOs.Auth;
using api.Enum;
using api.Interface;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly ITokenService _tokenService;

        private readonly SignInManager<ApplicationUser> _signInManager;

        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(ApplicationDbContext context, ITokenService tokenService, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = new ApplicationUser
                {
                    UserName = registerDTO.UserName
                };

                var result = await _userManager.CreateAsync(user, registerDTO.Password);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                var account = new Account
                {
                    UserName = registerDTO.UserName,
                    Password = registerDTO.Password,
                    Role = UserRole.Customer,
                    IsActive = true,
                    IdentityUserId = user.Id
                };

                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();
                var customer = new Customer
                {
                    FirstName = registerDTO.FirstName,
                    LastName = registerDTO.LastName,
                    Email = registerDTO.Email,
                    AccountId = account.Id
                };


                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                return Ok(registerDTO);

            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _userManager.Users.Include(u => u.Account).FirstOrDefaultAsync(x => x.UserName == loginDTO.UserName);

                if (user == null)
                    return Unauthorized("Invalid username");

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

                if (!result.Succeeded)
                    return Unauthorized("Invalid username or password");

                if (!user.Account.IsActive)
                    return Unauthorized("Account is disabled");



                var userDTO = new UserDTO
                {
                    Role = user.Account.Role.ToString(),
                    Token = _tokenService.CreateToken(user)
                };


                return Ok(new { message = "Login successful", data = userDTO });

            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }


    }
}