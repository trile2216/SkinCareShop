using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public bool Status { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<SkinCareStep> SkinCareSteps { get; set; } = new List<SkinCareStep>();
}
