using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Blog;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class BlogMapper
    {
        public static Blog ToBlogFromCreateDTO(this CreateBlogDTO blogCreateDTO)
        {
            return new Blog
            {
                Summary = blogCreateDTO.Summary,
                Content = blogCreateDTO.Content,
                Title = blogCreateDTO.Title,
                ImageUrl = blogCreateDTO.ImageUrl,
                CreatedAt = DateTime.Now,
            };
        }

        public static Blog ToBlogFromUpdateDTO(this UpdateBlogDTO blogUpdateDTO)
        {
            return new Blog
            {
                Summary = blogUpdateDTO.Summary,
                Content = blogUpdateDTO.Content,
                Title = blogUpdateDTO.Title,
                ImageUrl = blogUpdateDTO.ImageUrl,
            };
        }

        public static BlogDTO ToBlogDTO(this Blog blog)
        {
            return new BlogDTO
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                Summary = blog.Summary,
                ImageUrl = blog.ImageUrl,
                CreatedAt = blog.CreatedAt.ToString(),
            };
        }
    }
}