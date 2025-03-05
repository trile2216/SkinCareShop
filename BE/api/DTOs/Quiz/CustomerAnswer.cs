using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Quiz
{
    public class CustomerAnswerDTO
    {
        public int QuestionId { get; set; }
        public int AnswerId { get; set; }
    }
}