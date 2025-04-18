﻿using System;
using System.Collections.Generic;
using api.Constant;

namespace api.Models;

public partial class Order
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public decimal TotalPrice { get; set; }

    public DateTime OrderDate { get; set; }

    public decimal ShippingFee { get; set; }

    public string? DeliveryAddress { get; set; }

    public string? PaymentMethod { get; set; }

    public string? TransactionId { get; set; }

    public OrderStatus Status { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
