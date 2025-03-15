using System.Threading.Tasks;
using api.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;

namespace api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");

                // Debug thông tin
                Console.WriteLine($"SMTP Server: {emailSettings["SmtpServer"]}");
                Console.WriteLine($"Port: {emailSettings["Port"]}");
                Console.WriteLine($"Username: {emailSettings["Username"]}");

                var mail = new MailMessage
                {
                    From = new MailAddress(emailSettings["From"], emailSettings["DisplayName"]),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = true
                };
                mail.To.Add(new MailAddress(email));

                using var smtp = new SmtpClient();
                smtp.Host = emailSettings["SmtpServer"];
                smtp.Port = int.Parse(emailSettings["Port"]);
                smtp.EnableSsl = true; // Luôn bật SSL cho Gmail
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.UseDefaultCredentials = false; // Quan trọng: không sử dụng thông tin đăng nhập mặc định
                smtp.Credentials = new NetworkCredential(
                    emailSettings["Username"],
                    emailSettings["Password"]
                );

                await smtp.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
                // Ghi log chi tiết hơn
                Console.WriteLine($"Error sending email: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw; // Ném lại ngoại lệ để xử lý ở tầng trên
            }
        }
    }
}