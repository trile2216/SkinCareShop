using System;

namespace api.DTOs.Blog
{
    public class UpdateBlogDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public string Summary { get; set; }

        // Thêm 2 trường mới
        public string Skintype { get; set; }
        public string Category { get; set; }
    }
}
