using System.Collections.Generic;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface IBlogRepository
    {
        Task<List<Blog>> GetBlogsAsync();
        Task<Blog?> GetBlogByIdAsync(int id);
        Task<Blog?> CreateBlogAsync(Blog blog);
        Task<Blog?> UpdateBlogAsync(int id, Blog blog);
        Task<Blog?> DeleteBlogAsync(int id);

        // Thêm 2 hàm mới
        Task<List<string>> GetAllCategoriesAsync();
        Task<List<string>> GetAllSkintypesAsync();
    }
}
