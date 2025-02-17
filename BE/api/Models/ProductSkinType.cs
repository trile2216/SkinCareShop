using System;
using System.Collections.Generic;

namespace api.Models;

public partial class ProductSkinType
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int SkinTypeId { get; set; }

    public int RecommentedLevel { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual SkinType SkinType { get; set; } = null!;
}
