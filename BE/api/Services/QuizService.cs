using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Quiz;
using api.Constant;
using api.Interface;
using api.Models;

namespace api.Services
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository _quizRepo;

        public QuizService(IQuizRepository quizRepo)
        {
            _quizRepo = quizRepo;
        }

        public async Task<Dictionary<SkinElement, decimal>> CalculateElementScoresAsync(QuizSubmissionDTO submission)
        {
            var elementScores = new Dictionary<SkinElement, decimal>();
            var quiz = await _quizRepo.GetMainQuizByIdAsync(submission.MainQuizId);
            foreach (var quizAnswer in submission.CustomerAnswers)
            {
                var skinQuiz = await _quizRepo.GetSkinQuizByIdAsync(quizAnswer.SkinQuizId);
                if (skinQuiz == null)
                {
                    continue;
                }

                decimal actualScore = 0;
                decimal possibleMaxScore = 0;

                foreach (var answer in quizAnswer.Answers)
                {
                    var question = skinQuiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                    if (question == null) continue;

                    // Tính điểm thực tế
                    var selectedAnswer = question.Answers.FirstOrDefault(a => a.Id == answer.AnswerId);
                    if (selectedAnswer != null)
                    {
                        actualScore += selectedAnswer.Score;
                    }

                    // Tính điểm tối đa có thể cho câu hỏi này
                    possibleMaxScore += question.Answers.Max(a => a.Score);
                }

                // Lưu điểm dưới dạng phần trăm
                var element = (SkinElement)skinQuiz.SkinElement;  // Lấy enum SkinElement
                elementScores[element] = possibleMaxScore > 0
                    ? (actualScore / possibleMaxScore) * 100
                    : 0;
            }

            return elementScores;
        }

        public string DetermineSkinType(Dictionary<SkinElement, decimal> elementScores)
        {
            return $"{GetTypeCharacter(elementScores[SkinElement.Moisture], "D", "O")}" +
          $"{GetTypeCharacter(elementScores[SkinElement.Sensitivity], "S", "R")}" +
          $"{GetTypeCharacter(elementScores[SkinElement.Pigmentation], "P", "N")}" +
          $"{GetTypeCharacter(elementScores[SkinElement.Elasticity], "T", "W")}";
        }


        private string GetTypeCharacter(decimal scorePercentage, string baseType, string oppositeType)
        {
            return scorePercentage <= 60 ? baseType : oppositeType;
        }
    }
}