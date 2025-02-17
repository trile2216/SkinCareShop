using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Account
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int Role { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
