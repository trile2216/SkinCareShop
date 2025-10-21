using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Customer
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string AccountId { get; set; } = null!;

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<CustomerTestResult> CustomerTestResults { get; set; } = new List<CustomerTestResult>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
