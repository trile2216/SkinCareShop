using System;
using System.Collections.Generic;

namespace api.Models;

public partial class MainQuiz
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<CustomerTestResult> CustomerTestResults { get; set; } = new List<CustomerTestResult>();

    public virtual ICollection<SkinQuiz> SkinQuizzes { get; set; } = new List<SkinQuiz>();
}
