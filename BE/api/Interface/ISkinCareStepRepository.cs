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

        Task<SkinCareStep?> UpdateSkinCareStepAsync(int id, SkinCareStep skinCareStep);

        Task<SkinCareStep?> DeleteSkinCareStepAsync(int id);
    }
}