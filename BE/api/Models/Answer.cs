using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Answer
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public int QuestionId { get; set; }

    public decimal Score { get; set; }

    public virtual Question Question { get; set; } = null!;
}
