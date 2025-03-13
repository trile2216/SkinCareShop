using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ImportQuiz
{
    public class AnswerImportDTO
    {
        [Required]
        public string Content { get; set; }

        [Required]
        public decimal Score { get; set; }
    }
}