using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Categories
{
    public class UpdateCategoryDTO
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string? Description { get; set; }

        [Required]
        public bool Status { get; set; }
    }
}