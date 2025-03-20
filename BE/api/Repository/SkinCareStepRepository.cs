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
    public class SkinCareStepRepository : ISkinCareStepRepository
    {

        private readonly ApplicationDbContext _context;

        public SkinCareStepRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SkinCareStep> AddSkinCareStepAsync(SkinCareStep skinCareStep)
        {
            await _context.SkinCareSteps.AddAsync(skinCareStep);
            await _context.SaveChangesAsync();
            return skinCareStep;
        }

        public async Task<List<SkinCareStep>?> DeleteSkinCareStepByRoutineIdAsync(int routineId)
        {
            var skinCareStep = await GetSkinCareStepByRoutineIdAsync(routineId);
            if (skinCareStep == null)
            {
                return null;
            }

            _context.SkinCareSteps.RemoveRange(skinCareStep);
            await _context.SaveChangesAsync();

            return skinCareStep;
        }

        public async Task<SkinCareStep?> GetSkinCareStepByIdAsync(int id)
        {
            return await _context.SkinCareSteps.FirstOrDefaultAsync(step => step.Id == id);
        }

        public async Task<List<SkinCareStep>> GetSkinCareStepByRoutineIdAsync(int routineId)
        {
            return await _context.SkinCareSteps.Where(step => step.RoutineId == routineId).ToListAsync();
        }

        public async Task<List<SkinCareStep>> GetSkinCareStepsAsync()
        {
            return await _context.SkinCareSteps.ToListAsync();
        }

        public async Task<List<SkinCareStep>?> UpdateSkinCareStepByRoutineIdAsync(int routineId, List<SkinCareStep> skinCareSteps)
        {
            var existingSteps = await GetSkinCareStepByRoutineIdAsync(routineId);

            if (existingSteps.Count == 0)
            {
                return null;
            }

            foreach (var step in existingSteps)
            {
                if (!skinCareSteps.Any(s => s.Id == step.Id))
                {
                    _context.SkinCareSteps.Remove(step);
                    continue;
                }
                step.Name = skinCareSteps.First(s => s.Id == step.Id).Name;
                step.Description = skinCareSteps.First(s => s.Id == step.Id).Description;
                step.StepOrder = skinCareSteps.First(s => s.Id == step.Id).StepOrder;
                step.CategoryId = skinCareSteps.First(s => s.Id == step.Id).CategoryId;
            }
            await _context.SaveChangesAsync();
            return existingSteps;
        }
    }
}