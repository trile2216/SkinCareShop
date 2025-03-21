using System;
using api.DTOs.Blog;
using api.Models;

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

                // Thêm 2 trường mới
                Skintype = blogCreateDTO.Skintype,
                Category = blogCreateDTO.Category
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

                // Thêm 2 trường mới
                Skintype = blogUpdateDTO.Skintype,
                Category = blogUpdateDTO.Category
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

                // Thêm 2 trường mới
                Skintype = blog.Skintype,
                Category = blog.Category
            };
        }
    }
}
