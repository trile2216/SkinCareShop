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
    public class QuizRepository : IQuizRepository
    {
        private readonly ApplicationDbContext _context;

        public QuizRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MainQuiz> CreateMainQuizAsync(MainQuiz quiz)
        {
            _context.MainQuizzes.Add(quiz);
            await _context.SaveChangesAsync();
            return quiz;
        }

        public async Task<List<MainQuiz>> GetActiveMainQuizzesAsync()
        {
            return await _context.MainQuizzes
                .Where(m => m.IsActive)
                .Include(m => m.SkinQuizzes)
                    .ThenInclude(s => s.Questions)
                    .ThenInclude(q => q.Answers)
                .ToListAsync();
        }

        public async Task<List<MainQuiz>> GetMainQuizzesAsync()
        {
            return await _context.MainQuizzes
                .Include(m => m.SkinQuizzes)
                    .ThenInclude(s => s.Questions)
                    .ThenInclude(q => q.Answers)
                .ToListAsync();
        }
        public async Task<CustomerTestResult?> GetLatestCustomerResultAsync(int customerId)
        {
            return await _context.CustomerTestResults
                .Where(r => r.CustomerId == customerId && r.IsLastest)
                .FirstOrDefaultAsync();
        }

        public async Task<MainQuiz?> GetMainQuizByIdAsync(int id)
        {
            return await _context.MainQuizzes
                .Include(mq => mq.SkinQuizzes)
                    .ThenInclude(q => q.Questions)
                    .ThenInclude(s => s.Answers)
                .FirstOrDefaultAsync(mq => mq.Id == id);
        }

        public async Task<SkinQuiz?> GetSkinQuizByIdAsync(int id)
        {
            return await _context.SkinQuizzes
                   .Include(s => s.Questions)
                       .ThenInclude(q => q.Answers)
                   .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<SkinQuiz>> GetSkinQuizzesByMainQuizIdAsync(int mainQuizId)
        {
            return await _context.SkinQuizzes
                        .Where(s => s.MainQuizId == mainQuizId)
                        .Include(s => s.Questions)
                            .ThenInclude(q => q.Answers)
                        .ToListAsync();
        }

        public async Task<CustomerTestResult?> SaveCustomerResultAsync(CustomerTestResult result)
        {
            _context.CustomerTestResults.Add(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<MainQuiz?> UpdateMainQuizAsync(int id, MainQuiz quiz)
        {
            var existingQuiz = await GetMainQuizByIdAsync(id);
            if (existingQuiz == null)
            {
                return null;
            }

            existingQuiz.IsActive = quiz.IsActive;

            await _context.SaveChangesAsync();
            return existingQuiz;
        }

        public async Task UpdatePreviousResultsAsync(int customerId)
        {
            var lastestResult = await GetLatestCustomerResultAsync(customerId);
            if (lastestResult != null)
            {
                lastestResult.IsLastest = false;
                await _context.SaveChangesAsync();
            }
        }
    }
}