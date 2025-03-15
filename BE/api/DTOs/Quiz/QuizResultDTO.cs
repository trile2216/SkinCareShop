using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Quiz
{
    public class QuizResultDTO
    {
        public int ResultId { get; set; }
        public int SkinTypeId { get; set; }

        public string? Symbol { get; set; }

        public string? Characteristics { get; set; }
    }
}