using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.SkinCare;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class SkinCareMapper
    {
        public static RoutineDTO ToRoutineDTO(this SkinCareRoutine routine)
        {
            return new RoutineDTO
            {
                Id = routine.Id,
                SkinTypeId = routine.SkinTypeId,
                Time = routine.Time,
                Name = routine.Name,
                Description = routine.Description,
                Steps = routine.SkinCareSteps.Select(s => s.ToStepDTO()).ToList()
            };
        }

        public static SkinCareRoutine ToRoutineFromUpdateDTO(this UpdateRoutineDTO updateRoutineDTO)
        {
            return new SkinCareRoutine
            {
                SkinTypeId = updateRoutineDTO.SkinTypeId,
                Time = updateRoutineDTO.Time,
                Name = updateRoutineDTO.Name,
                Description = updateRoutineDTO.Description,
                SkinCareSteps = updateRoutineDTO.Steps.Select(s => s.ToStep()).ToList()
            };
        }

        public static StepDTO ToStepDTO(this SkinCareStep step)
        {
            return new StepDTO
            {
                Id = step.Id,
                Name = step.Name,
                Description = step.Description,
                StepOrder = step.StepOrder,
                CategoryId = step.CategoryId,
                RoutineId = step.RoutineId
            };
        }

        public static SkinCareStep ToStep(this StepDTO stepDTO)
        {
            return new SkinCareStep
            {
                Name = stepDTO.Name,
                Description = stepDTO.Description,
                StepOrder = stepDTO.StepOrder,
                CategoryId = stepDTO.CategoryId,
                RoutineId = stepDTO.RoutineId
            };
        }


    }
}