using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class BlogRepository : IBlogRepository
    {
        private readonly ApplicationDbContext _context;

        public BlogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Blog?> CreateBlogAsync(Blog blog)
        {
            await _context.Blogs.AddAsync(blog);
            await _context.SaveChangesAsync();
            return blog;
        }

        public async Task<Blog?> DeleteBlogAsync(int id)
        {
            var blog = await GetBlogByIdAsync(id);
            if (blog == null)
            {
                return null;
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return blog;
        }

        public Task<Blog?> GetBlogByIdAsync(int id)
        {
            return _context.Blogs.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Blog>> GetBlogsAsync()
        {
            return await _context.Blogs.ToListAsync();
        }

        public async Task<Blog?> UpdateBlogAsync(int id, Blog blog)
        {
            var existingBlog = await GetBlogByIdAsync(id);
            if (existingBlog == null)
            {
                return null;
            }

            existingBlog.Title = blog.Title;
            existingBlog.ImageUrl = blog.ImageUrl;
            existingBlog.Summary = blog.Summary;
            existingBlog.Content = blog.Content;

            await _context.SaveChangesAsync();
            return existingBlog;
        }
    }
}