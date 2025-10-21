using System;
using System.Collections.Generic;
using api.Constant;

namespace api.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Ingredient { get; set; }

    public string? Image { get; set; }

    public Gender Gender { get; set; }

    public int Stock { get; set; }

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public string? Size { get; set; }

    public int BrandId { get; set; }

    public decimal? Sale { get; set; }

    public decimal Price { get; set; }

    public bool Status { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<ProductSkinType> ProductSkinTypes { get; set; } = new List<ProductSkinType>();
}
