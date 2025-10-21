using System;
using System.Collections.Generic;
using api.Constant;
using Microsoft.AspNetCore.Identity;

namespace api.Models;

public partial class Account : IdentityUser
{   
    // Xóa Password vì Identity đã có PasswordHash
    // public string? Password { get; set; }

    public UserRole Role { get; set; }

    public bool IsActive { get; set; }

    public virtual Customer? Customer { get; set; }
}
