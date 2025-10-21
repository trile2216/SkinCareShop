using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Quiz;
using api.Models;

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
                CreatedDate = mainQuiz.CreatedAt.ToString(),
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
                Score = answer.Score,
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

        public static Question ToQuestionFromDTO(this QuestionDTO questionDTO)
        {
            return new Question
            {
                Id = questionDTO.Id,
                Content = questionDTO.Content,
                Answers = questionDTO.Answers.Select(a => a.ToAnswerFromDTO()).ToList()
            };
        }

        public static Answer ToAnswerFromDTO(this AnswerDTO answerDTO)
        {
            return new Answer
            {
                Id = answerDTO.Id,
                Content = answerDTO.Content,
                Score = answerDTO.Score,
            };
        }
    }
}