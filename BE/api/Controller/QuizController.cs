using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.DTOs.Quiz;
using api.Interface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/quiz")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        private readonly IQuizRepository _quizRepo;

        private readonly ISkinTypeRepository _skinTypeRepo;

        public QuizController(IQuizService quizService, IQuizRepository quizRepo, ISkinTypeRepository skinTypeRepo)
        {
            _quizService = quizService;
            _quizRepo = quizRepo;
            _skinTypeRepo = skinTypeRepo;
        }

        [HttpGet]
        [Route("active")]
        public async Task<IActionResult> GetActiveQuizzes()
        {
            var quizzes = await _quizRepo.GetActiveMainQuizzesAsync();

            if (quizzes.Count == 0)
            {
                return NotFound("No active quizzes found");
            }

            var quizDTOs = quizzes.Select(q => q.ToMainQuizDTO()).ToList();
            return Ok(quizDTOs);
        }

        [HttpGet]
        [Route("{quizId:int}")]
        public async Task<IActionResult> GetQuizById(int quizId)
        {
            var quiz = await _quizRepo.GetMainQuizByIdAsync(quizId);

            if (quiz == null)
            {
                return NotFound("Quiz not found");
            }

            var quizDTO = quiz.ToMainQuizDTO();
            return Ok(quizDTO);
        }

        [HttpPost]
        [Route("submit")]
        public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmissionDTO quizSubmission)
        {
            try
            {
                var elementScores = await _quizService.CalculateElementScoresAsync(quizSubmission);

                var skinTypeSymbol = _quizService.DetermineSkinType(elementScores);

                var skinType = await _skinTypeRepo.GetSkinTypeBySymbolAsync(skinTypeSymbol);

                if (skinType == null)
                {
                    return NotFound("Skin type not found");
                }

                var result = new CustomerTestResult
                {
                    CustomerId = quizSubmission.CustomerId,
                    MainQuizId = quizSubmission.MainQuizId,
                    SkinTypeId = skinType.Id,
                    IsLastest = true
                };

                await _quizRepo.UpdatePreviousResultsAsync(quizSubmission.CustomerId);

                await _quizRepo.SaveCustomerResultAsync(result);



                return Ok(result.ToResultDTO());
            }
            catch (Exception ex)
            {
                return BadRequest($"Error processing quiz: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("result/{customerId:int}")]
        public async Task<IActionResult> GetCustomerResult(int customerId)
        {
            var result = await _quizRepo.GetLatestCustomerResultAsync(customerId);

            if (result == null)
            {
                return NotFound("Result not found");
            }

            return Ok(result.ToResultDTO());
        }
    }
}