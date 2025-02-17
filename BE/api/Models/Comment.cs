using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Comment
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int CustomerId { get; set; }

    public string Content { get; set; } = null!;

    public int Rating { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
