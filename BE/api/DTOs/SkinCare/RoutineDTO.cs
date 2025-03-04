using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.SkinCare
{
    public class RoutineDTO
    {
        public int Id { get; set; }

        public int SkinTypeId { get; set; }

        public string Time { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public List<StepDTO> Steps { get; set; } = new List<StepDTO>();
    }
}