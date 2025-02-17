using System;
using System.Collections.Generic;

namespace api.Models;

public partial class SkinCareRoutine
{
    public int Id { get; set; }

    public int SkinTypeId { get; set; }

    public string Time { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<SkinCareStep> SkinCareSteps { get; set; } = new List<SkinCareStep>();

    public virtual SkinType SkinType { get; set; } = null!;
}
