using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Constant;

namespace api.DTOs.Quiz
{
    public class QuizAnswerDTO
    {
        public int SkinQuizId { get; set; }
        public SkinElement SkinElement { get; set; }
        public List<CustomerAnswerDTO> Answers { get; set; }
    }
}