using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ImportQuiz
{
    public class ImportTemplate
    {
        public string QuestionContent { get; set; }
        public string SkinElement { get; set; }
        public string Answer1Content { get; set; }
        public decimal Answer1Score { get; set; }
        public string Answer2Content { get; set; }
        public decimal Answer2Score { get; set; }
        public string Answer3Content { get; set; }
        public decimal Answer3Score { get; set; }
        public string Answer4Content { get; set; }
        public decimal Answer4Score { get; set; }
    }
}