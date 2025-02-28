using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{

    [ApiController]
    [Route("api/skintype")]
    public class SkinTypeController : ControllerBase
    {
        private readonly ISkinTypeRepository _skinTypeRepo;

        public SkinTypeController(ISkinTypeRepository skinTypeRepo)
        {
            _skinTypeRepo = skinTypeRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetSkinTypes()
        {
            var skinTypes = await _skinTypeRepo.GetAllSkinTypeAsync();

            if (skinTypes.Count() == 0)
            {
                return NotFound("No skin types found");
            }

            var skinTypeDTOs = skinTypes.Select(s => s.ToSkinTypeDTO());

            return Ok(skinTypeDTOs);
        }
    }
}