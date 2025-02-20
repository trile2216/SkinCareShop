using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.DTOs.Comments
{
    public class CommentDTO
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int CustomerId { get; set; }

        public string Content { get; set; } = null!;

        public int Rating { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}