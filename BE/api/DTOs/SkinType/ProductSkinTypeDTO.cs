using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.SkinType
{
    public class ProductSkinTypeDTO
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int SkinTypeId { get; set; }

        public int RecommentedLevel { get; set; }
    }
}