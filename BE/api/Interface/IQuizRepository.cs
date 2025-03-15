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

        Task<MainQuiz?> GetActiveMainQuizAsync();

        Task<List<MainQuiz>> GetMainQuizzesAsync();

        Task<MainQuiz> CreateMainQuizAsync(MainQuiz quiz);

        Task<MainQuiz?> SetActiveAsync(int id, bool isActive);

        Task<SkinQuiz?> GetSkinQuizByIdAsync(int id);

        Task<List<SkinQuiz>> GetSkinQuizzesByMainQuizIdAsync(int mainQuizId);

        Task<CustomerTestResult?> SaveCustomerResultAsync(CustomerTestResult result);

        Task<CustomerTestResult?> GetLatestCustomerResultAsync(int customerId);

        Task UpdatePreviousResultsAsync(int customerId);
    }
}