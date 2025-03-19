using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
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
    }
}