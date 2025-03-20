using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.SkinCare
{
    public class CreateStepDTO
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string? Description { get; set; }

        [Required]
        [Range(1, 20)]
        public int StepOrder { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}