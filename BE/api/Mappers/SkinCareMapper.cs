using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.SkinCare;
using api.Models;

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

        public static SkinCareRoutine ToRoutineFromCreateDTO(this CreateRoutineDTO routineRequestDTO)
        {
            return new SkinCareRoutine
            {
                SkinTypeId = routineRequestDTO.SkinTypeId,
                Time = routineRequestDTO.Time,
                Name = routineRequestDTO.Name,
                Description = routineRequestDTO.Description,
            };
        }

        public static SkinCareRoutine ToRoutineFromUpdateDTO(this UpdateRoutineDTO routineRequestDTO)
        {
            return new SkinCareRoutine
            {
                SkinTypeId = routineRequestDTO.SkinTypeId,
                Time = routineRequestDTO.Time,
                Name = routineRequestDTO.Name,
                Description = routineRequestDTO.Description,
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
            };
        }

        public static SkinCareStep ToStepFromDTO(this StepDTO stepDTO, int routineId)
        {
            return new SkinCareStep
            {
                Id = stepDTO.Id,
                Name = stepDTO.Name,
                Description = stepDTO.Description,
                StepOrder = stepDTO.StepOrder,
                CategoryId = stepDTO.CategoryId,
                RoutineId = routineId
            };
        }

        public static SkinCareStep ToStepFromUpdateDTO(this UpdateStepDTO stepRequestDTO, int routineId)
        {
            return new SkinCareStep
            {
                Id = stepRequestDTO.Id,
                Name = stepRequestDTO.Name,
                Description = stepRequestDTO.Description,
                StepOrder = stepRequestDTO.StepOrder,
                CategoryId = stepRequestDTO.CategoryId,
                RoutineId = routineId
            };
        }

        public static SkinCareStep ToStepFromCreateDTO(this CreateStepDTO stepRequestDTO, int routineId)
        {
            return new SkinCareStep
            {
                Name = stepRequestDTO.Name,
                Description = stepRequestDTO.Description,
                StepOrder = stepRequestDTO.StepOrder,
                CategoryId = stepRequestDTO.CategoryId,
                RoutineId = routineId
            };
        }
    }
}