using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ISkinCareRoutineRepository
    {
        Task<List<SkinCareRoutine>> GetSkinCareRoutinesAsync();

        Task<SkinCareRoutine?> GetSkinCareRoutineByIdAsync(int id);

        Task<List<SkinCareRoutine>> GetSkinCareRoutineBySkinTypeIdAsync(int skinTypeId);

        Task<SkinCareRoutine> CreateSkinCareRoutineAsync(SkinCareRoutine skinCareRoutine);

        Task<SkinCareRoutine?> UpdateSkinCareRoutineAsync(int id, SkinCareRoutine skinCareRoutine);

        Task<SkinCareRoutine?> DeleteSkinCareRoutineAsync(int id);
    }
}