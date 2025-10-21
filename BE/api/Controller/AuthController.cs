using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.DTOs.Auth;
using api.Constant;
using api.Interface;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Net;

namespace api.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly ITokenService _tokenService;

        private readonly SignInManager<Account> _signInManager;

        private readonly UserManager<Account> _userManager;

        private readonly IAccountRepository _accountRepo;

        private readonly ICartService _cartService;

        private readonly IEmailService _emailService;

        private readonly IConfiguration _configuration;


        public AuthController(
            ApplicationDbContext context,
            ITokenService tokenService,
            SignInManager<Account> signInManager,
            UserManager<Account> userManager,
            IAccountRepository accountRepo,
            ICartService cartService,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _context = context;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _accountRepo = accountRepo;
            _cartService = cartService;
            _emailService = emailService;
            _configuration = configuration;
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

                var existingUser = await _context.Accounts.FirstOrDefaultAsync(a => a.UserName == registerDTO.UserName && a.IsActive == true);
                if (existingUser != null)
                {
                    return BadRequest("Username is already taken");
                }

                var existingEmail = await _context.Customers.FirstOrDefaultAsync(c => c.Email == registerDTO.Email && c.Account.IsActive == true);
                if (existingEmail != null)
                {
                    return BadRequest("Email is already registered");
                }

                var account = new Account
                    {
                        UserName = registerDTO.UserName,
                        Role = UserRole.Customer,
                        IsActive = true,
                    };
                var result = await _userManager.CreateAsync(account, registerDTO.Password);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

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

                var user = await _userManager.Users
                    .Include(a => a.Customer)
                    .FirstOrDefaultAsync(x => x.UserName == loginDTO.UserName);

                if (user == null)
                    return Unauthorized("Invalid username");

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

                if (!result.Succeeded)
                    return Unauthorized("Invalid username or password");

                if (!user.IsActive)
                    return Unauthorized("Account is disabled");



                var userDTO = new UserDTO
                {
                    CustomerId = user.Customer?.Id,
                    Role = user.Role.ToString(),
                    Token = _tokenService.CreateToken(user)
                };


                return Ok(new { message = "Login successful", data = userDTO });

            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPost]
        [Route("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
                _cartService.ClearCart();

                return Ok("Logout successful");
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPost]
        [Route("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userName == null)
            {
                return Unauthorized("Invalid user");
            }

            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDTO.CurrentPassword, changePasswordDTO.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Password changed successfully");
        }

        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Tìm người dùng bằng email
                var customer = await _context.Customers
                    .Include(c => c.Account)
                    .FirstOrDefaultAsync(c => c.Email == forgotPasswordDTO.Email);

                if (customer == null || customer.Account == null)
                {
                    // Không báo lỗi chi tiết để bảo vệ thông tin
                    return Ok("Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu");
                }

                var user = customer.Account;

                // Tạo token đặt lại mật khẩu
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                // Tạo URL đặt lại mật khẩu
                var frontendUrl = _configuration["FrontendUrl"]; // Cấu hình URL của frontend trong appsettings.json
                var resetUrl = $"{frontendUrl}/reset-password?email={WebUtility.UrlEncode(forgotPasswordDTO.Email)}&token={WebUtility.UrlEncode(token)}";

                // Tạo nội dung email
                var message = $@"
                    <h3>Reset Password</h3>
                    <p>Please click the link below to reset your password:</p>
                    <p><a href='{resetUrl}'>Reset Password</a></p>
                    <p>This link will expire in 3 hours.</p>
                    <p>If you did not request a password reset, please ignore this email.</p>
                ";

                // Gửi email
                await _emailService.SendEmailAsync(forgotPasswordDTO.Email, "Reset Password", message);

                return Ok("If the email exists, you will receive password reset instructions.");
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }


                var customer = await _context.Customers
                    .Include(c => c.Account)
                    .FirstOrDefaultAsync(c => c.Email == resetPasswordDTO.Email);

                if (customer == null || customer.Account == null)
                {
                    return BadRequest("Email không hợp lệ");
                }

                var user = customer.Account;

                // Đặt lại mật khẩu
                var result = await _userManager.ResetPasswordAsync(user, resetPasswordDTO.Token, resetPasswordDTO.NewPassword);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                customer.Account.PasswordHash = _userManager.PasswordHasher.HashPassword(customer.Account, resetPasswordDTO.NewPassword);

                await _context.SaveChangesAsync();

                return Ok("Mật khẩu đã được đặt lại thành công");
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }
    }
}