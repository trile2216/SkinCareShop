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

        public async Task<List<SkinCareStep>?> UpdateSkinCareStepByRoutineIdAsync(int routineId, List<SkinCareStep> newSkinCareSteps)
        {
            var existingSteps = await GetSkinCareStepByRoutineIdAsync(routineId);
            if (existingSteps == null)
            {
                return null;
            }

            var recordsToUpdate = new List<SkinCareStep>();

            foreach (var newStep in newSkinCareSteps)
            {
                var existingStep = existingSteps.FirstOrDefault(s => s.Id == newStep.Id);
                if (existingStep != null)
                {
                    existingStep.Name = newStep.Name;
                    existingStep.Description = newStep.Description;
                    existingStep.StepOrder = newStep.StepOrder;
                    existingStep.RoutineId = newStep.RoutineId;

                }
                else
                {
                    await _context.SkinCareSteps.AddAsync(newStep);
                }
            }

            var idsToKeep = newSkinCareSteps.Select(s => s.Id).ToList();
            var recordsToDelete = existingSteps.Where(s => !idsToKeep.Contains(s.Id)).ToList();
            if (recordsToDelete.Count != 0)
            {
                _context.SkinCareSteps.RemoveRange(recordsToDelete);
            }

            await _context.SaveChangesAsync();
            return await GetSkinCareStepByRoutineIdAsync(routineId);
        }
    }
}