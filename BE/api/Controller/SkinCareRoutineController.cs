using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.SkinCare;
using api.Interface;
using api.Mappers;
using api.Models;
using Google.Apis.Util;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var skinCareRoutine = await _skinCareRoutineRepo.GetSkinCareRoutineByIdAsync(id);

            if (skinCareRoutine == null)
            {
                return NotFound("Skin care routine not found");
            }

            var routineDTO = skinCareRoutine.ToRoutineDTO();
            return Ok(routineDTO);
        }

        [HttpGet]
        [Route("skintype/{id:int}")]
        public async Task<IActionResult> GetSkinCareRoutineBySkinTypeId([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var routines = await _skinCareRoutineRepo.GetSkinCareRoutineBySkinTypeIdAsync(id);

            if (routines.Count == 0)
            {
                return NotFound("No skin care routines found");
            }

            var routineDTO = routines.Select(r => r.ToRoutineDTO()).ToList();
            return Ok(routineDTO);
        }

        [HttpPut]
        [Route("update/{id:int}")]
        public async Task<IActionResult> UpdateRoutineAsync([FromRoute] int id, [FromBody] UpdateRoutineDTO updateRoutineDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var steps = updateRoutineDTO.Steps.Select(s => s.ToStepFromUpdateDTO(id)).ToList();

            await _skinCareStepRepo.UpdateSkinCareStepByRoutineIdAsync(id, steps);


            var routine = await _skinCareRoutineRepo.UpdateSkinCareRoutineAsync(id, updateRoutineDTO.ToRoutineFromUpdateDTO());

            if (routine == null)
            {
                return NotFound("Skin care routine not found");
            }

            return Ok(routine.ToRoutineDTO());
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateRoutineAsync([FromBody] CreateRoutineDTO createRoutineDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var routine = createRoutineDTO.ToRoutineFromCreateDTO();

            var createdRoutine = await _skinCareRoutineRepo.CreateSkinCareRoutineAsync(routine);
            var steps = createRoutineDTO.Steps.Select(s => s.ToStepFromCreateDTO(createdRoutine.Id)).ToList();

            foreach (var step in steps)
            {
                await _skinCareStepRepo.AddSkinCareStepAsync(step);
            }

            return CreatedAtAction(nameof(GetSkinCareRoutineById), new { id = routine.Id }, routine.ToRoutineDTO());
        }

        [HttpDelete]
        [Route("delete/{id:int}")]
        public async Task<IActionResult> DeleteRoutineAsync([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var routine = await _skinCareRoutineRepo.GetSkinCareRoutineByIdAsync(id);

            if (routine == null)
            {
                return NotFound("Skin care routine not found");
            }


            await _skinCareStepRepo.DeleteSkinCareStepByRoutineIdAsync(id);

            await _skinCareRoutineRepo.DeleteSkinCareRoutineAsync(id);

            return Ok(routine);
        }

    }
}