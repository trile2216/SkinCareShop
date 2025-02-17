using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace api.Models;

public partial class Account
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public UserRole Role { get; set; }

    public bool IsActive { get; set; }

    public string IdentityUserId { get; set; } = null!;

    public virtual ApplicationUser IdentityUser { get; set; } = null!;

    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
