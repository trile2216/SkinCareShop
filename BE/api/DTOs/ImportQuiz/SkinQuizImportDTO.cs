using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Constant;

namespace api.DTOs.ImportQuiz
{
    public class SkinQuizImportDTO
    {
        public SkinElement SkinElement { get; set; }
        public List<QuestionImportDTO> Questions { get; set; }
    }
}