using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IQuizRepository
    {
        Task<MainQuiz?> GetMainQuizByIdAsync(int id);

        Task<List<MainQuiz>> GetActiveMainQuizzesAsync();

        Task<MainQuiz> CreateMainQuizAsync(MainQuiz quiz);

        Task<MainQuiz?> UpdateMainQuizAsync(int id, MainQuiz quiz);

        Task<SkinQuiz?> GetSkinQuizByIdAsync(int id);

        Task<List<SkinQuiz>> GetSkinQuizzesByMainQuizIdAsync(int mainQuizId);

        Task<CustomerTestResult?> SaveCustomerResultAsync(CustomerTestResult result);

        Task<CustomerTestResult?> GetLatestCustomerResultAsync(int customerId);

        Task UpdatePreviousResultsAsync(int customerId);
    }
}