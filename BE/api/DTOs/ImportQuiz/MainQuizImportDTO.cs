using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.ImportQuiz
{
    public class MainQuizImportDTO
    {

        [Required]
        public bool IsActive { get; set; } = false;

        [Required]
        public List<SkinQuizImportDTO> SkinQuizzes { get; set; }
    }
}