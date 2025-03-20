using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.SkinCare
{
    public class CreateRoutineDTO
    {
        [Required]
        public int SkinTypeId { get; set; }

        [Required]
        public string Time { get; set; } = null!;

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string? Description { get; set; }

        [Required]
        public List<CreateStepDTO> Steps { get; set; } = new List<CreateStepDTO>();
    }
}