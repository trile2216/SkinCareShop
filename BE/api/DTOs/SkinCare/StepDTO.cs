using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.SkinCare
{
    public class StepDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public int StepOrder { get; set; }

        public int CategoryId { get; set; }
    }
}