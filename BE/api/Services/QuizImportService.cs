using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using api.Constant;
using api.Data;
using api.DTOs.ImportQuiz;
using api.Interface;
using api.Models;
using CsvHelper;
using CsvHelper.Configuration;
using OfficeOpenXml;
using ValidationException = System.ComponentModel.DataAnnotations.ValidationException;

namespace api.Services
{
    public class QuizImportService : IQuizImportService
    {
        private readonly ApplicationDbContext _context;

        public QuizImportService(ApplicationDbContext context)
        {
            _context = context;
        }
        public MemoryStream GenerateTemplateFile()
        {
            var stream = new MemoryStream();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Quiz Template");
                worksheet.Cells[1, 1].Value = "Question Content";
                worksheet.Cells[1, 2].Value = "Skin Element (Moisture/Sensitivity/Pigmentation/Elasticity)";
                worksheet.Cells[1, 3].Value = "Answer 1 Content";
                worksheet.Cells[1, 4].Value = "Answer 1 Score";
                worksheet.Cells[1, 5].Value = "Answer 2 Content";
                worksheet.Cells[1, 6].Value = "Answer 2 Score";
                worksheet.Cells[1, 7].Value = "Answer 3 Content";
                worksheet.Cells[1, 8].Value = "Answer 3 Score";
                worksheet.Cells[1, 9].Value = "Answer 4 Content";
                worksheet.Cells[1, 10].Value = "Answer 4 Score";

                using (var range = worksheet.Cells[1, 1, 1, 10])
                {
                    range.Style.Font.Bold = true;
                    range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                }

                var validationList = "Moisture,Sensitivity,Pigmentation,Aging";
                var validation = worksheet.DataValidations.AddListValidation(worksheet.Cells[2, 2, 100, 2].Address);
                validation.Formula.Values.Add(validationList);
                worksheet.Cells[2, 1].Value = "How does your skin feel after cleansing?";
                worksheet.Cells[2, 2].Value = "Moisture";
                worksheet.Cells[2, 3].Value = "Tight and dry";
                worksheet.Cells[2, 4].Value = 1.0;
                worksheet.Cells[2, 5].Value = "Slightly dry";
                worksheet.Cells[2, 6].Value = 2.0;
                worksheet.Cells[2, 7].Value = "Normal, no special feeling";
                worksheet.Cells[2, 8].Value = 3.0;
                worksheet.Cells[2, 9].Value = "Oily and shiny";
                worksheet.Cells[2, 10].Value = 4.0;

                worksheet.Cells[3, 1].Value = "How often do you experience redness?";
                worksheet.Cells[3, 2].Value = "Sensitivity";
                worksheet.Cells[3, 3].Value = "Never";
                worksheet.Cells[3, 4].Value = 1.0;
                worksheet.Cells[3, 5].Value = "Rarely";
                worksheet.Cells[3, 6].Value = 2.0;
                worksheet.Cells[3, 7].Value = "Sometimes";
                worksheet.Cells[3, 8].Value = 3.0;
                worksheet.Cells[3, 9].Value = "Frequently";
                worksheet.Cells[3, 10].Value = 4.0;

                worksheet.Cells[4, 1].Value = "NOTE: Please fill all questions with 4 answers. Each skin element should have at least 8 questions.";

                using (var range = worksheet.Cells[4, 1, 4, 10])
                {
                    range.Merge = true;
                    range.Style.Font.Bold = true;
                    range.Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }

                worksheet.Cells.AutoFitColumns();
                package.SaveAs(stream);
                stream.Position = 0;
                return stream;
            }
        }

        public async Task<int> ImportQuizAsync(MainQuizImportDTO importData)
        {
            if (importData == null || importData.SkinQuizzes == null || importData.SkinQuizzes.Count == 0)
            {
                throw new ArgumentException("Dữ liệu nhập vào không hợp lệ hoặc trống");
            }

            if (importData.SkinQuizzes.Count > 4)
            {
                throw new ArgumentException("Số lượng SkinQuiz không được vượt quá 4");
            }

            var skinElements = importData.SkinQuizzes.Select(sq => sq.SkinElement).ToList();
            if (skinElements.Count != skinElements.Distinct().Count())
            {
                throw new ArgumentException("Các SkinElement không được trùng lặp");
            }
            foreach (var skinQuiz in importData.SkinQuizzes)
            {
                // Kiểm tra SkinElement có hợp lệ không
                if (!Enum.IsDefined(typeof(SkinElement), skinQuiz.SkinElement))
                {
                    throw new ArgumentException($"SkinElement không hợp lệ: {skinQuiz.SkinElement}");
                }

                // Kiểm tra số lượng câu hỏi - yêu cầu tối thiểu 8 câu hỏi cho mỗi SkinElement
                if (skinQuiz.Questions == null || skinQuiz.Questions.Count < 8)
                {
                    throw new ArgumentException($"SkinElement {skinQuiz.SkinElement} cần có ít nhất 8 câu hỏi");
                }

                // Kiểm tra chi tiết từng câu hỏi
                foreach (var question in skinQuiz.Questions)
                {
                    if (string.IsNullOrWhiteSpace(question.Content))
                    {
                        throw new ArgumentException($"SkinElement {skinQuiz.SkinElement} có câu hỏi trống");
                    }

                    // Kiểm tra số lượng câu trả lời - yêu cầu đúng 4 câu trả lời cho mỗi câu hỏi
                    if (question.Answers == null || question.Answers.Count != 4)
                    {
                        throw new ArgumentException($"Câu hỏi '{question.Content}' phải có đúng 4 câu trả lời");
                    }

                    // Kiểm tra chi tiết từng câu trả lời
                    foreach (var answer in question.Answers)
                    {
                        if (string.IsNullOrWhiteSpace(answer.Content))
                        {
                            throw new ArgumentException($"Câu trả lời của câu hỏi '{question.Content}' không được để trống");
                        }

                        // Kiểm tra điểm số (điểm số phải nằm trong khoảng hợp lệ, ví dụ: 1-5)
                        if (answer.Score < 1 || answer.Score > 5)
                        {
                            throw new ArgumentException($"Điểm số của câu trả lời '{answer.Content}' phải từ 1 đến 5");
                        }
                    }
                }
            }
            try
            {
                // 3. Tạo và lưu MainQuiz
                var mainQuiz = new MainQuiz
                {
                    CreatedAt = DateTime.Now,
                    IsActive = false
                };

                // Thêm MainQuiz vào database và lưu để lấy ID
                _context.MainQuizzes.Add(mainQuiz);
                await _context.SaveChangesAsync();

                int totalRecords = 0; // Biến đếm tổng số bản ghi đã tạo
                totalRecords++; // Đã tạo 1 MainQuiz

                // 4. Tạo và lưu SkinQuiz cho từng loại da
                foreach (var skinQuizDto in importData.SkinQuizzes)
                {
                    var skinQuiz = new SkinQuiz
                    {
                        MainQuizId = mainQuiz.Id,
                        SkinElement = skinQuizDto.SkinElement.GetHashCode(),
                    };

                    _context.SkinQuizzes.Add(skinQuiz);
                    await _context.SaveChangesAsync(); // Lưu để lấy ID
                    totalRecords++; // Đã tạo thêm 1 SkinQuiz

                    // 5. Tạo và lưu Question cho từng SkinQuiz
                    foreach (var questionDto in skinQuizDto.Questions)
                    {
                        var question = new Question
                        {
                            Content = questionDto.Content,
                            SkinQuizId = skinQuiz.Id
                        };

                        _context.Questions.Add(question);
                        await _context.SaveChangesAsync(); // Lưu để lấy ID
                        totalRecords++; // Đã tạo thêm 1 Question

                        // 6. Tạo và lưu Answer cho từng Question
                        foreach (var answerDto in questionDto.Answers)
                        {
                            var answer = new Answer
                            {
                                Content = answerDto.Content,
                                QuestionId = question.Id,
                                Score = answerDto.Score
                            };

                            _context.Answers.Add(answer);
                            totalRecords++; // Đã tạo thêm 1 Answer
                        }
                    }
                }

                // Lưu tất cả các câu trả lời vào database
                await _context.SaveChangesAsync();
                return totalRecords;
            }
            catch (Exception ex)
            {
                throw new Exception("Không thể nhập dữ liệu quiz: " + ex.Message, ex);
            }
        }

        public async Task<MainQuizImportDTO> ParseCsvFileAsync(IFormFile file)
        {
            var result = new MainQuizImportDTO();
            result.SkinQuizzes = new List<SkinQuizImportDTO>();

            var skinQuizDict = new Dictionary<string, SkinQuizImportDTO>();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0; // Reset stream position to beginning

                using (var reader = new StreamReader(stream))
                using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HasHeaderRecord = true,
                    Delimiter = ",",
                    MissingFieldFound = null, // Bỏ qua lỗi field thiếu
                    BadDataFound = null,      // Bỏ qua lỗi dữ liệu không hợp lệ
                    TrimOptions = TrimOptions.Trim, // Xóa khoảng trắng thừa
                    PrepareHeaderForMatch = args => args.Header.Replace(" ", String.Empty)
                }))
                {
                    // Đọc header
                    csv.Read();
                    csv.ReadHeader();

                    // Đọc từng dòng
                    while (csv.Read())
                    {
                        var questionContent = csv.GetField("Question Content");
                        var skinElementStr = csv.GetField("Skin Element (Moisture/Sensitivity/Pigmentation/Elasticity)");

                        // Bỏ qua nếu không có nội dung câu hỏi hoặc loại skin element
                        if (string.IsNullOrWhiteSpace(questionContent) || string.IsNullOrWhiteSpace(skinElementStr))
                            continue;

                        // Xử lý skin element từ chuỗi
                        skinElementStr = skinElementStr.Trim();
                        if (!Enum.TryParse<SkinElement>(skinElementStr, out var skinElement))
                            continue;

                        var question = new QuestionImportDTO
                        {
                            Content = questionContent,
                            Answers = new List<AnswerImportDTO>()
                        };

                        // Đọc 4 câu trả lời
                        for (int i = 1; i <= 4; i++)
                        {
                            var content = csv.GetField($"Answer {i} Content");
                            var scoreStr = csv.GetField($"Answer {i} Score");

                            decimal score = 0;
                            if (!string.IsNullOrWhiteSpace(scoreStr))
                            {
                                decimal.TryParse(scoreStr, out score);
                            }

                            if (!string.IsNullOrWhiteSpace(content))
                            {
                                question.Answers.Add(new AnswerImportDTO
                                {
                                    Content = content,
                                    Score = score
                                });
                            }
                        }

                        // Thêm câu hỏi vào quiz nếu có đủ 4 câu trả lời
                        if (question.Answers.Count == 4)
                        {
                            if (!skinQuizDict.ContainsKey(skinElementStr))
                            {
                                skinQuizDict[skinElementStr] = new SkinQuizImportDTO
                                {
                                    SkinElement = skinElement,
                                    Questions = new List<QuestionImportDTO>()
                                };
                            }

                            skinQuizDict[skinElementStr].Questions.Add(question);
                        }
                    }
                }
            }

            result.SkinQuizzes = skinQuizDict.Values.ToList();
            return result;
        }


        public async Task<MainQuizImportDTO> ParseExcelFileAsync(IFormFile file)
        {
            var result = new MainQuizImportDTO();
            result.SkinQuizzes = new List<SkinQuizImportDTO>();

            // Tạo dictionary để nhóm câu hỏi theo SkinElement
            var skinQuizDict = new Dictionary<string, SkinQuizImportDTO>();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null)
                        throw new Exception("Không tìm thấy worksheet trong file Excel");

                    // Bắt đầu từ dòng 2 (sau phần header)
                    int row = 2;
                    while (string.IsNullOrWhiteSpace(worksheet.Cells[row, 1].Value?.ToString()) == false)
                    {
                        string questionContent = worksheet.Cells[row, 1].Value?.ToString();
                        string skinElementStr = worksheet.Cells[row, 2].Value?.ToString();

                        if (string.IsNullOrWhiteSpace(skinElementStr))
                            continue;

                        // Chuyển đổi string thành enum SkinElement
                        if (!Enum.TryParse(skinElementStr, out SkinElement skinElement))
                            continue;

                        var question = new QuestionImportDTO
                        {
                            Content = questionContent,
                            Answers = new List<AnswerImportDTO>()
                        };

                        // Phân tích 4 câu trả lời (cột 3-10)
                        for (int i = 0; i < 4; i++)
                        {
                            var contentCol = 3 + (i * 2);
                            var scoreCol = 4 + (i * 2);

                            var content = worksheet.Cells[row, contentCol].Value?.ToString();
                            decimal score = 0;
                            decimal.TryParse(worksheet.Cells[row, scoreCol].Value?.ToString(), out score);

                            if (!string.IsNullOrWhiteSpace(content))
                            {
                                question.Answers.Add(new AnswerImportDTO
                                {
                                    Content = content,
                                    Score = score
                                });
                            }
                        }

                        // Chỉ thêm câu hỏi nếu nó có đủ 4 câu trả lời
                        if (question.Answers.Count == 4)
                        {
                            // Thêm câu hỏi vào SkinQuiz tương ứng
                            if (!skinQuizDict.ContainsKey(skinElementStr))
                            {
                                skinQuizDict[skinElementStr] = new SkinQuizImportDTO
                                {
                                    SkinElement = skinElement,
                                    Questions = new List<QuestionImportDTO>()
                                };
                            }

                            skinQuizDict[skinElementStr].Questions.Add(question);
                        }

                        row++;
                    }
                }
            }

            // Thêm tất cả SkinQuiz vào MainQuiz
            result.SkinQuizzes = skinQuizDict.Values.ToList();

            return result;
        }

        public bool ValidateTemplate(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ValidationException("File không được để trống");
            }
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".xlsx" && extension != ".xls" && extension != ".csv")
            {
                throw new ValidationException("Định dạng file không hợp lệ. Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV (.csv)");
            }

            if (file.Length > 5 * 1024 * 1024)
            {
                throw new ValidationException("Kích thước file vượt quá giới hạn 10MB");
            }
            return true;
        }

        public async Task<bool> ValidateExcelStructure(IFormFile file)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                        if (worksheet == null)
                        {
                            throw new ValidationException("Không tìm thấy worksheet trong file Excel");
                        }

                        // Kiểm tra số lượng cột
                        if (worksheet.Dimension.End.Column < 10)
                        {
                            throw new ValidationException("Cấu trúc file không hợp lệ. File phải có ít nhất 10 cột");
                        }

                        // Kiểm tra tiêu đề các cột
                        var expectedHeaders = new[]
                        {
                            "Question Content",
                            "Skin Element (Moisture/Sensitivity/Pigmentation/Elasticity)",
                            "Answer 1 Content",
                            "Answer 1 Score",
                            "Answer 2 Content",
                            "Answer 2 Score",
                            "Answer 3 Content",
                            "Answer 3 Score",
                            "Answer 4 Content",
                            "Answer 4 Score"
                        };

                        for (int i = 1; i <= expectedHeaders.Length; i++)
                        {
                            var headerValue = worksheet.Cells[1, i].Value?.ToString();
                            if (string.IsNullOrEmpty(headerValue) || !headerValue.Equals(expectedHeaders[i - 1], StringComparison.OrdinalIgnoreCase))
                            {
                                throw new ValidationException($"Tiêu đề cột {i} không khớp với định dạng mẫu. " +
                                                            $"Mong đợi '{expectedHeaders[i - 1]}', " +
                                                            $"nhưng nhận được '{headerValue ?? "trống"}'");
                            }
                        }

                        // Kiểm tra có dữ liệu không
                        if (worksheet.Dimension.End.Row <= 1)
                        {
                            throw new ValidationException("File không chứa dữ liệu. Vui lòng thêm ít nhất một dòng dữ liệu");
                        }

                        // Kiểm tra SkinElement có hợp lệ không
                        var validSkinElements = Enum.GetNames(typeof(SkinElement));
                        bool hasAnyValidData = false;

                        for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                        {
                            var questionContent = worksheet.Cells[row, 1].Value?.ToString();
                            var skinElement = worksheet.Cells[row, 2].Value?.ToString();

                            // Bỏ qua dòng trống
                            if (string.IsNullOrWhiteSpace(questionContent))
                            {
                                continue;
                            }

                            hasAnyValidData = true;

                            // Kiểm tra SkinElement
                            if (string.IsNullOrWhiteSpace(skinElement))
                            {
                                throw new ValidationException($"Dòng {row}: Skin Element không được để trống");
                            }

                            if (!validSkinElements.Contains(skinElement, StringComparer.OrdinalIgnoreCase))
                            {
                                throw new ValidationException($"Dòng {row}: Skin Element '{skinElement}' không hợp lệ. " +
                                                             $"Các giá trị hợp lệ: {string.Join(", ", validSkinElements)}");
                            }

                            // Kiểm tra nội dung câu hỏi
                            if (string.IsNullOrWhiteSpace(questionContent))
                            {
                                throw new ValidationException($"Dòng {row}: Nội dung câu hỏi không được để trống");
                            }

                            // Kiểm tra đủ 4 câu trả lời
                            for (int i = 0; i < 4; i++)
                            {
                                var contentCol = 3 + (i * 2);
                                var scoreCol = 4 + (i * 2);
                                var content = worksheet.Cells[row, contentCol].Value?.ToString();
                                var scoreValue = worksheet.Cells[row, scoreCol].Value;

                                if (string.IsNullOrWhiteSpace(content))
                                {
                                    throw new ValidationException($"Dòng {row}: Nội dung Answer {i + 1} không được để trống");
                                }

                                if (scoreValue == null || !double.TryParse(scoreValue.ToString(), out double score))
                                {
                                    throw new ValidationException($"Dòng {row}: Score của Answer {i + 1} phải là số");
                                }

                                if (score < 1 || score > 5)
                                {
                                    throw new ValidationException($"Dòng {row}: Score của Answer {i + 1} phải từ 1 đến 5");
                                }
                            }
                        }

                        if (!hasAnyValidData)
                        {
                            throw new ValidationException("File không chứa dữ liệu hợp lệ");
                        }

                        // Kiểm tra yêu cầu tối thiểu 8 câu hỏi cho mỗi SkinElement
                        var questionsByElement = new Dictionary<string, int>();
                        for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                        {
                            var skinElement = worksheet.Cells[row, 2].Value?.ToString();
                            if (!string.IsNullOrWhiteSpace(skinElement))
                            {
                                if (!questionsByElement.ContainsKey(skinElement))
                                {
                                    questionsByElement[skinElement] = 0;
                                }
                                questionsByElement[skinElement]++;
                            }
                        }

                        foreach (var element in questionsByElement.Keys)
                        {
                            if (questionsByElement[element] < 8)
                            {
                                throw new ValidationException($"SkinElement '{element}' cần có ít nhất 8 câu hỏi, " +
                                                            $"nhưng chỉ có {questionsByElement[element]} câu hỏi");
                            }
                        }

                        return true;
                    }
                }
            }
            catch (ValidationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new ValidationException($"Lỗi khi xử lý file Excel: {ex.Message}", ex);
            }
        }

        public async Task<bool> ValidateCsvStructure(IFormFile file)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    using (var reader = new StreamReader(stream, Encoding.UTF8))
                    {
                        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
                        {
                            HasHeaderRecord = true,
                            Delimiter = ",",
                            MissingFieldFound = null,
                            BadDataFound = null,
                            Mode = CsvMode.RFC4180,
                            TrimOptions = TrimOptions.Trim,

                            PrepareHeaderForMatch = args => args.Header.Trim()
                        };

                        using (var csv = new CsvReader(reader, config))
                        {
                            if (!csv.Read() || !csv.ReadHeader())
                            {
                                throw new ValidationException("File CSV không có tiêu đề hoặc không thể đọc tiêu đề");
                            }

                            var headers = csv.HeaderRecord;
                            if (headers.Length < 10)
                            {
                                throw new ValidationException($"Cấu trúc file CSV không hợp lệ. Cần ít nhất 10 cột, nhưng chỉ có {headers.Length} cột");
                            }

                            var expectedHeaders = new[]
                            {
                        "Question Content",
                        "Skin Element (Moisture/Sensitivity/Pigmentation/Elasticity)",
                        "Answer 1 Content",
                        "Answer 1 Score",
                        "Answer 2 Content",
                        "Answer 2 Score",
                        "Answer 3 Content",
                        "Answer 3 Score",
                        "Answer 4 Content",
                        "Answer 4 Score"
                    };

                            for (int i = 0; i < expectedHeaders.Length; i++)
                            {
                                if (i >= headers.Length || !headers[i].Trim().Equals(expectedHeaders[i], StringComparison.OrdinalIgnoreCase))
                                {
                                    throw new ValidationException($"Tiêu đề cột {i + 1} không khớp với định dạng mẫu. " +
                                                                $"Mong đợi '{expectedHeaders[i]}', " +
                                                                $"nhưng nhận được '{(i < headers.Length ? headers[i] : "thiếu")}'");
                                }
                            }

                            var validSkinElements = Enum.GetNames(typeof(SkinElement));
                            bool hasAnyValidData = false;
                            var questionsByElement = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                            int rowIndex = 2;

                            while (csv.Read())
                            {
                                var questionContent = csv.GetField(0)?.Trim();
                                var skinElement = csv.GetField(1)?.Trim();

                                if (string.IsNullOrWhiteSpace(questionContent))
                                {
                                    rowIndex++;
                                    continue;
                                }

                                hasAnyValidData = true;

                                if (string.IsNullOrWhiteSpace(skinElement))
                                {
                                    throw new ValidationException($"Dòng {rowIndex}: Skin Element không được để trống");
                                }

                                if (!validSkinElements.Contains(skinElement, StringComparer.OrdinalIgnoreCase))
                                {
                                    throw new ValidationException($"Dòng {rowIndex}: Skin Element '{skinElement}' không hợp lệ. " +
                                                                $"Các giá trị hợp lệ: {string.Join(", ", validSkinElements)}");
                                }

                                if (!questionsByElement.ContainsKey(skinElement))
                                {
                                    questionsByElement[skinElement] = 0;
                                }
                                questionsByElement[skinElement]++;

                                for (int i = 0; i < 4; i++)
                                {
                                    var contentIndex = 2 + (i * 2);
                                    var scoreIndex = 3 + (i * 2);

                                    var content = csv.GetField(contentIndex)?.Trim();
                                    var scoreStr = csv.GetField(scoreIndex)?.Trim();

                                    if (string.IsNullOrWhiteSpace(content))
                                    {
                                        throw new ValidationException($"Dòng {rowIndex}: Nội dung Answer {i + 1} không được để trống");
                                    }

                                    if (string.IsNullOrWhiteSpace(scoreStr) || !double.TryParse(scoreStr, NumberStyles.Any, CultureInfo.InvariantCulture, out double score))
                                    {
                                        throw new ValidationException($"Dòng {rowIndex}: Score của Answer {i + 1} phải là số. Giá trị hiện tại là '{scoreStr}'");
                                    }

                                    if (score < 1 || score > 5)
                                    {
                                        throw new ValidationException($"Dòng {rowIndex}: Score của Answer {i + 1} phải từ 1 đến 5");
                                    }
                                }

                                rowIndex++;
                            }

                            if (!hasAnyValidData)
                            {
                                throw new ValidationException("File không chứa dữ liệu hợp lệ");
                            }

                            foreach (var element in questionsByElement.Keys)
                            {
                                if (questionsByElement[element] < 8)
                                {
                                    throw new ValidationException($"SkinElement '{element}' cần có ít nhất 8 câu hỏi, " +
                                                                $"nhưng chỉ có {questionsByElement[element]} câu hỏi");
                                }
                            }

                            return true;
                        }
                    }
                }
            }
            catch (ValidationException)
            {
                throw;
            }
            catch (CsvHelper.MissingFieldException ex)
            {
                throw new ValidationException($"Lỗi khi xử lý file CSV - Thiếu dữ liệu trong một hoặc nhiều cột: {ex.Message}", ex);
            }
            catch (CsvHelper.HeaderValidationException ex)
            {
                throw new ValidationException($"Lỗi khi xử lý file CSV - Tiêu đề không hợp lệ: {ex.Message}", ex);
            }
            catch (CsvHelper.ReaderException ex)
            {
                throw new ValidationException($"Lỗi khi xử lý file CSV - Không thể đọc dữ liệu: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new ValidationException($"Lỗi khi xử lý file CSV: {ex.Message}", ex);
            }
        }
    }
}