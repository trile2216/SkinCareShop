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
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDbContext _context;

        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Comment> AddCommentAsync(Comment comment)
        {
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<Comment?> DeleteCommentAsync(int id)
        {
            var comment = await GetCommentByIdAsync(id);
            if (comment == null)
            {
                return null;
            }

            _context.Comments.Remove(comment);
            _context.SaveChanges();
            return comment;
        }

        public async Task<List<Comment>> GetAllCommentsAsync()
        {
            return await _context.Comments
                .Include(c => c.Customer)
                .Include(c => c.Product)
                .ToListAsync();
        }

        public Task<Comment?> GetCommentByIdAsync(int id)
        {
            return _context.Comments
                .Include(c => c.Customer)
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public Task<List<Comment>> GetCommentsByCustomerIdAsync(int cumtomerId)
        {
            return _context.Comments
                .Where(c => c.CustomerId == cumtomerId)
                .Include(c => c.Customer)
                .Include(c => c.Product)
                .ToListAsync();
        }

        public Task<List<Comment>> GetCommentsByProductIdAsync(int productId)
        {
            return _context.Comments
                .Where(c => c.ProductId == productId)
                .Include(c => c.Customer)
                .Include(c => c.Product)
                .ToListAsync();
        }

        public async Task<Comment?> UpdateCommentAsync(int id, Comment comment)
        {
            var existingComment = await GetCommentByIdAsync(id);
            if (existingComment == null)
            {
                return null;
            }

            existingComment.Content = comment.Content;
            existingComment.Rating = comment.Rating;

            await _context.SaveChangesAsync();
            return existingComment;
        }
    }
}