using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Quiz;
using api.Enum;
using api.Models;

namespace api.Interface
{
    public interface IQuizService
    {
        Task<Dictionary<SkinElement, decimal>> CalculateElementScoresAsync(QuizSubmissionDTO submission);

        string DetermineSkinType(Dictionary<SkinElement, decimal> elementScores);
    }
}