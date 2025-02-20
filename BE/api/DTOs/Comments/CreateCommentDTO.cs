using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Serialization;

namespace api.DTOs.Comments
{
    public class CreateCommentDTO
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        [Required]
        [Range(1, 5, ErrorMessage = ("Rating must be between 1 and 5"))]
        public int Rating { get; set; }

    }
}