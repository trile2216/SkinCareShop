using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Quiz;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class QuizMapper
    {
        public static MainQuizDTO ToMainQuizDTO(this MainQuiz mainQuiz)
        {
            return new MainQuizDTO
            {
                Id = mainQuiz.Id,
                SkinQuizzes = mainQuiz.SkinQuizzes.Select(sq => sq.ToSkinQuizDTO()).ToList(),
                IsActive = mainQuiz.IsActive
            };
        }
        public static SkinQuizDTO ToSkinQuizDTO(this SkinQuiz quiz)
        {
            return new SkinQuizDTO
            {
                Id = quiz.Id,
                SkinElement = quiz.SkinElement.ToString(),
                Questions = quiz.Questions.Select(q => q.ToQuestionDTO()).ToList()
            };
        }

        public static QuestionDTO ToQuestionDTO(this Question question)
        {
            return new QuestionDTO
            {
                Id = question.Id,
                Content = question.Content,
                Answers = question.Answers.Select(a => ToAnswerDTO(a)).ToList()
            };
        }

        public static AnswerDTO ToAnswerDTO(this Answer answer)
        {
            return new AnswerDTO
            {
                Id = answer.Id,
                Content = answer.Content,
            };
        }

        public static QuizResultDTO ToResultDTO(this CustomerTestResult customerTestResult)
        {
            return new QuizResultDTO
            {
                ResultId = customerTestResult.Id,
                SkinTypeId = customerTestResult.SkinTypeId,
                Symbol = customerTestResult.SkinType.Symbol,
                Characteristics = customerTestResult.SkinType.Characteristics
            };
        }
    }
}