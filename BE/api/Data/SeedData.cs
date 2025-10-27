using System;
using System.Threading.Tasks;
using api.Models;
using api.Constant;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace api.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;

            var userManager = services.GetRequiredService<UserManager<Account>>();
            var config = services.GetRequiredService<IConfiguration>();

            var adminUserName = config["Admin:User"] ?? "admin";
            var adminPassword = config["Admin:Password"] ?? "Admin@12345!"; // override via env var



            // create admin user if not exists
            var user = await userManager.FindByNameAsync(adminUserName);
            if (user == null)
            {
                user = new Account
                {
                    UserName = adminUserName,
                    EmailConfirmed = true,
                    IsActive = true,
                    Role = UserRole.Admin
                };

                var result = await userManager.CreateAsync(user, adminPassword);
                if (!result.Succeeded)
                {
                    throw new Exception("Failed to create admin user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }


            }
            else
            {
                if (!user.IsActive)
                {
                    user.IsActive = true;
                    await userManager.UpdateAsync(user);
                }
            }
        }
    }
}