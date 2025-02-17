using System;
using System.Collections.Generic;

namespace api.Models;

public partial class SkinType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Symbol { get; set; }

    public string? Characteristics { get; set; }

    public virtual ICollection<CustomerTestResult> CustomerTestResults { get; set; } = new List<CustomerTestResult>();

    public virtual ICollection<ProductSkinType> ProductSkinTypes { get; set; } = new List<ProductSkinType>();

    public virtual ICollection<SkinCareRoutine> SkinCareRoutines { get; set; } = new List<SkinCareRoutine>();
}
