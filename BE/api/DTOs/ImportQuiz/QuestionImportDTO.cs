using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ImportQuiz
{
    public class QuestionImportDTO
    {
        [Required]
        public string Content { get; set; }

        [Required]
        public List<AnswerImportDTO> Answers { get; set; }
    }
}