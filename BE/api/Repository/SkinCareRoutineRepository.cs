using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class SkinCareRoutineRepository : ISkinCareRoutineRepository
    {
        public readonly ApplicationDbContext _context;

        public SkinCareRoutineRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SkinCareRoutine> CreateSkinCareRoutineAsync(SkinCareRoutine skinCareRoutine)
        {
            await _context.SkinCareRoutines.AddAsync(skinCareRoutine);
            await _context.SaveChangesAsync();
            return skinCareRoutine;
        }

        public async Task<SkinCareRoutine?> DeleteSkinCareRoutineAsync(int id)
        {
            var skinCareRoutine = await GetSkinCareRoutineByIdAsync(id);

            if (skinCareRoutine == null)
            {
                return null;
            }

            _context.SkinCareRoutines.Remove(skinCareRoutine);
            await _context.SaveChangesAsync();

            return skinCareRoutine;
        }

        public async Task<SkinCareRoutine?> GetSkinCareRoutineByIdAsync(int id)
        {
            return await _context.SkinCareRoutines
                .Include(scr => scr.SkinCareSteps)
                .FirstOrDefaultAsync(scr => scr.Id == id);
        }

        public async Task<List<SkinCareRoutine>> GetSkinCareRoutineBySkinTypeIdAsync(int skinTypeId)
        {
            return await _context.SkinCareRoutines
                .Include(scr => scr.SkinCareSteps)
                .Where(scr => scr.SkinTypeId == skinTypeId).ToListAsync();
        }

        public async Task<List<SkinCareRoutine>> GetSkinCareRoutinesAsync()
        {
            return await _context.SkinCareRoutines
                .Include(scr => scr.SkinCareSteps).ToListAsync();
        }

        public async Task<SkinCareRoutine?> UpdateSkinCareRoutineAsync(int id, SkinCareRoutine skinCareRoutine)
        {
            var existingSkinCareRoutine = await GetSkinCareRoutineByIdAsync(id);

            if (existingSkinCareRoutine == null)
            {
                return null;
            }

            existingSkinCareRoutine.SkinTypeId = skinCareRoutine.SkinTypeId;
            existingSkinCareRoutine.Name = skinCareRoutine.Name;
            existingSkinCareRoutine.Time = skinCareRoutine.Time;
            existingSkinCareRoutine.Description = skinCareRoutine.Description;

            await _context.SaveChangesAsync();

            return existingSkinCareRoutine;

        }
    }
}