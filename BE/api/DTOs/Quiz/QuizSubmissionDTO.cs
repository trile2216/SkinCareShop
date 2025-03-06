using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Quiz
{
    public class QuizSubmissionDTO
    {
        public int MainQuizId { get; set; }

        public int CustomerId { get; set; }

        public List<QuizAnswerDTO> CustomerAnswers { get; set; }
    }
}