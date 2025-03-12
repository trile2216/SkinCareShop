using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Constant;

namespace api.DTOs.Quiz
{
    public class SkinQuizDTO
    {
        public int Id { get; set; }
        public string? SkinElement { get; set; }
        public List<QuestionDTO> Questions { get; set; }
    }
}