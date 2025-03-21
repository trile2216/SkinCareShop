using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Blog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public string ImageUrl { get; set; }

        public string Summary { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Thêm 2 thuộc tính mới
        public string Skintype { get; set; }
        public string Category { get; set; }
    }
}
