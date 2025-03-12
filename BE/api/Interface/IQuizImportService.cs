using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.ImportQuiz;
using api.DTOs.Quiz;

namespace api.Interface
{
    public interface IQuizImportService
    {
        MemoryStream GenerateTemplateFile();
        Task<MainQuizImportDTO> ParseExcelFileAsync(IFormFile file);
        Task<MainQuizImportDTO> ParseCsvFileAsync(IFormFile file);
        Task<int> ImportQuizAsync(MainQuizImportDTO importData);
        bool ValidateTemplate(IFormFile file);
        Task<bool> ValidateExcelStructure(IFormFile file);
        Task<bool> ValidateCsvStructure(IFormFile file);

    }
}