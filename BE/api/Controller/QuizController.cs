using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.DTOs.Quiz;
using api.Interface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
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

        private readonly IQuizImportService _quizImportService;

        public QuizController(IQuizService quizService, IQuizRepository quizRepo, ISkinTypeRepository skinTypeRepo, IQuizImportService quizImportService)
        {
            _quizService = quizService;
            _quizRepo = quizRepo;
            _skinTypeRepo = skinTypeRepo;
            _quizImportService = quizImportService;
        }

        [HttpGet("download-template")]
        public IActionResult DownloadTemplate()
        {
            var stream = _quizImportService.GenerateTemplateFile();
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "quiz_template.xlsx");
        }

        [HttpGet]
        [Route("active")]
        public async Task<IActionResult> GetActiveQuiz()
        {
            var quiz = await _quizRepo.GetActiveMainQuizAsync();

            if (quiz == null)
            {
                return NotFound("No active quizzes found");
            }

            var quizDTO = quiz.ToMainQuizDTO();
            return Ok(quizDTO);
        }

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            var quizzes = await _quizRepo.GetMainQuizzesAsync();

            if (quizzes.Count == 0)
            {
                return NotFound("No quizzes found");
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

        [HttpPost]
        [Route("import/excel")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportQuizFromExcel(IFormFile file)
        {
            try
            {
                // Kiểm tra file
                if (file == null || file.Length == 0)
                    return BadRequest("Không có file nào được chọn");

                // Kiểm tra định dạng file
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (extension != ".xlsx" && extension != ".xls")
                    return BadRequest("Chỉ chấp nhận file Excel (.xlsx, .xls)");

                // Kiểm tra cấu trúc của file
                try
                {
                    await _quizImportService.ValidateExcelStructure(file);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Lỗi cấu trúc file: {ex.Message}");
                }

                // Parse dữ liệu từ file Excel
                var importData = await _quizImportService.ParseExcelFileAsync(file);

                // Thực hiện import vào database
                var recordsCreated = await _quizImportService.ImportQuizAsync(importData);

                return Ok(new
                {
                    message = $"Import thành công",
                    data = recordsCreated
                });
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết nhưng chỉ trả về thông báo lỗi ngắn gọn cho client
                return StatusCode(500, new { error = $"Lỗi khi import quiz: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("import/csv")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportQuizFromCsv(IFormFile file)
        {
            try
            {
                // Kiểm tra file
                if (file == null || file.Length == 0)
                    return BadRequest("Không có file nào được chọn");

                // Kiểm tra định dạng file
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (extension != ".csv")
                    return BadRequest("Chỉ chấp nhận file CSV (.csv)");

                // Kiểm tra cấu trúc của file
                try
                {
                    await _quizImportService.ValidateCsvStructure(file);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Lỗi cấu trúc file: {ex.Message}");
                }

                // Parse dữ liệu từ file CSV
                var importData = await _quizImportService.ParseCsvFileAsync(file);
                // Thực hiện import vào database
                var recordsCreated = await _quizImportService.ImportQuizAsync(importData);

                return Ok(new
                {
                    message = $"Import thành công",
                    data = recordsCreated
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Lỗi khi import quiz: {ex.Message}" });
            }
        }

        [HttpPut]
        [Route("change-status/{quizId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeQuizStatus([FromRoute] int quizId, [FromBody] bool isActive)
        {
            try
            {
                var quiz = await _quizRepo.SetActiveAsync(quizId, isActive);
                if (quiz == null)
                {
                    return NotFound("Quiz not found");
                }

                if (isActive)
                {
                    return Ok(new
                    {
                        message = "Quiz status updated successfully. All other quizzes have been deactivated.",
                        quiz = quiz.ToMainQuizDTO()
                    });
                }
                else
                {
                    return Ok(new
                    {
                        message = "Quiz has been deactivated.",
                        quiz = quiz.ToMainQuizDTO()
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error updating quiz status: {ex.Message}" });
            }
        }


    }
}