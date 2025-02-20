using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetAllCommentsAsync();

        Task<Comment?> GetCommentByIdAsync(int id);

        Task<Comment> AddCommentAsync(Comment comment);

        Task<Comment?> UpdateCommentAsync(int id, Comment comment);

        Task<Comment?> DeleteComment(int id);

        Task<List<Comment>> GetCommentsByProductIdAsync(int productId);

        Task<List<Comment>> GetCommentsByCustomerIdAsync(int cumtomerId);

    }
}