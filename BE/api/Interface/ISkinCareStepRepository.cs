using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ISkinCareStepRepository
    {
        Task<List<SkinCareStep>> GetSkinCareStepsAsync();

        Task<SkinCareStep?> GetSkinCareStepByIdAsync(int id);

        Task<List<SkinCareStep>> GetSkinCareStepByRoutineIdAsync(int routineId);

        Task<SkinCareStep> AddSkinCareStepAsync(SkinCareStep skinCareStep);

        Task<List<SkinCareStep>?> UpdateSkinCareStepByRoutineIdAsync(int routineId, List<SkinCareStep> skinCareSteps);

        Task<List<SkinCareStep>?> DeleteSkinCareStepByRoutineIdAsync(int routineId);
    }
}