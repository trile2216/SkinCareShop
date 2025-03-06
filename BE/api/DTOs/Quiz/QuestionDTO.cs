using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Quiz
{
    public class QuestionDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public List<AnswerDTO> Answers { get; set; }
    }
}