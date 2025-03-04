using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.SkinCare;
using api.Interface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace api.Controller
{
    [ApiController]
    [Route("api/routine")]
    public class SkinCareRoutineController : ControllerBase
    {
        private readonly ISkinCareRoutineRepository _skinCareRoutineRepo;

        private readonly ISkinCareStepRepository _skinCareStepRepo;

        public SkinCareRoutineController(ISkinCareRoutineRepository skinCareRoutineRepo, ISkinCareStepRepository skinCareStepRepo)
        {
            _skinCareRoutineRepo = skinCareRoutineRepo;
            _skinCareStepRepo = skinCareStepRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetSkinCareRoutines()
        {
            var skinCareRoutines = await _skinCareRoutineRepo.GetSkinCareRoutinesAsync();

            if (skinCareRoutines.Count == 0)
            {
                return NotFound("No skin care routines found");
            }

            var routineDTO = skinCareRoutines.Select(r => r.ToRoutineDTO()).ToList();
            return Ok(routineDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetSkinCareRoutineById(int id)
        {
            var skinCareRoutine = await _skinCareRoutineRepo.GetSkinCareRoutineByIdAsync(id);

            if (skinCareRoutine == null)
            {
                return NotFound("Skin care routine not found");
            }

            var routineDTO = skinCareRoutine.ToRoutineDTO();
            return Ok(routineDTO);
        }

        // [HttpPost]
        // [Route("{id:int}")]
        // public async Task<IActionResult> UpdateRoutineAsync([FromRoute] int id, [FromBody] UpdateRoutineDTO updateRoutineDTO)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     var steps = updateRoutineDTO.Steps.Select(s => s.ToStep()).ToList();

        //     foreach (var step in steps)
        //     {
        //         await _skinCareStepRepo.AddSkinCareStepAsync(step);
        //     }

        //     var routine = updateRoutineDTO.ToRoutineFromUpdateDTO();

        //     await _skinCareRoutineRepo.UpdateSkinCareRoutineAsync(id, routine);

        //     return Ok();
        // }

        [HttpGet]
        [Route("skintype/{id:int}")]
        public async Task<IActionResult> GetSkinCareRoutineBySkinTypeId([FromRoute] int id)
        {
            var routines = await _skinCareRoutineRepo.GetSkinCareRoutineBySkinTypeIdAsync(id);

            if (routines.Count == 0)
            {
                return NotFound("No skin care routines found");
            }

            var routineDTO = routines.Select(r => r.ToRoutineDTO()).ToList();
            return Ok(routineDTO);
        }

    }
}