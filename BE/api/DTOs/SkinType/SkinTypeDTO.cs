using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace api.DTOs.SkinType
{
    public class SkinTypeDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public string? Symbol { get; set; }

        public string? Characteristics { get; set; }
    }
}