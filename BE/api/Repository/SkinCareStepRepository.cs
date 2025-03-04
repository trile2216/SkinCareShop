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

        public async Task<SkinCareStep?> DeleteSkinCareStepAsync(int id)
        {
            var skinCareStep = await GetSkinCareStepByIdAsync(id);
            if (skinCareStep == null)
            {
                return null;
            }

            _context.SkinCareSteps.Remove(skinCareStep);
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

        public async Task<SkinCareStep?> UpdateSkinCareStepAsync(int id, SkinCareStep skinCareStep)
        {
            var existingStep = await GetSkinCareStepByIdAsync(id);

            if (existingStep == null)
            {
                return null;
            }

            existingStep.Name = skinCareStep.Name;
            existingStep.Description = skinCareStep.Description;
            existingStep.StepOrder = skinCareStep.StepOrder;

            await _context.SaveChangesAsync();
            return existingStep;
        }
    }
}