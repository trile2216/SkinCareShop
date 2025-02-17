using System;
using System.Collections.Generic;

namespace api.Models;

public partial class SkinCareStep
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int StepOrder { get; set; }

    public int CategoryId { get; set; }

    public int RoutineId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual SkinCareRoutine Routine { get; set; } = null!;
}
