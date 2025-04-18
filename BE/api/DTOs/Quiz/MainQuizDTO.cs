using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Quiz
{
    public class MainQuizDTO
    {
        public int Id { get; set; }
        public List<SkinQuizDTO> SkinQuizzes { get; set; }

        public string CreatedDate { get; set; }
        public bool IsActive { get; set; }
    }
}