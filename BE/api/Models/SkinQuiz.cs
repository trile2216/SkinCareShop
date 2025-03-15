using System;
using System.Collections.Generic;
using api.Constant;

namespace api.Models;

public partial class SkinQuiz
{
    public int Id { get; set; }

    public int MainQuizId { get; set; }

    public SkinElement SkinElement { get; set; }

    public virtual MainQuiz MainQuiz { get; set; } = null!;

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
