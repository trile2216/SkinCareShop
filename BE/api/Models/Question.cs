using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Question
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public int SkinQuizId { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual SkinQuiz SkinQuiz { get; set; } = null!;
}
