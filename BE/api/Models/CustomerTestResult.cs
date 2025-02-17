using System;
using System.Collections.Generic;

namespace api.Models;

public partial class CustomerTestResult
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public int MainQuizId { get; set; }

    public int SkinTypeId { get; set; }

    public bool IsLastest { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual MainQuiz MainQuiz { get; set; } = null!;

    public virtual SkinType SkinType { get; set; } = null!;
}
