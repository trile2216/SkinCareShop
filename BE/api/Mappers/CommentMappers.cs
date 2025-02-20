using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Comments;
using api.Models;

namespace api.Mappers
{
    public static class CommentMappers
    {
        public static CommentDTO ToCommentDTO(this Comment comment)
        {
            return new CommentDTO
            {
                Id = comment.Id,
                Content = comment.Content,
                Rating = comment.Rating,
                ProductId = comment.ProductId,
                CustomerId = comment.CustomerId,
                CreatedAt = comment.CreatedAt
            };
        }

        public static Comment ToCommentFromCreateDTO(this CreateCommentDTO createCommentDTO)
        {
            return new Comment
            {
                Content = createCommentDTO.Content,
                Rating = createCommentDTO.Rating,
                ProductId = createCommentDTO.ProductId,
                CustomerId = createCommentDTO.CustomerId,
                CreatedAt = DateTime.Now
            };
        }

        public static Comment ToCommentFromUpdateDTO(this UpdateCommentDTO updateCommentDTO)
        {
            return new Comment
            {
                Content = updateCommentDTO.Content,
                Rating = updateCommentDTO.Rating
            };
        }
    }
}