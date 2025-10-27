using System;
using System.Collections.Generic;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace api.Data;

public partial class ApplicationDbContext : IdentityDbContext<Account>
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<CustomerTestResult> CustomerTestResults { get; set; }

    public virtual DbSet<MainQuiz> MainQuizzes { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductSkinType> ProductSkinTypes { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<SkinCareRoutine> SkinCareRoutines { get; set; }

    public virtual DbSet<SkinCareStep> SkinCareSteps { get; set; }

    public virtual DbSet<SkinQuiz> SkinQuizzes { get; set; }

    public virtual DbSet<SkinType> SkinTypes { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<District> Districts { get; set; }

    public virtual DbSet<ShippingFee> ShippingFees { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("Account");

            // Không cần map Password nữa
            entity.Property(e => e.Role)
                .HasConversion<int>()
                .HasColumnName("role");
    
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Answer");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.QuestionId).HasColumnName("questionId");
            entity.Property(e => e.Score)
                .HasColumnType("numeric(4, 2)")
                .HasColumnName("score");

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Brand");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Category");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Comment");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdAt");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Rating).HasColumnName("rating");

            entity.HasOne(d => d.Customer).WithMany(p => p.Comments)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Product).WithMany(p => p.Comments)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Customer");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .HasColumnName("address");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("lastName");
            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .HasColumnName("phone");

            entity.HasOne(d => d.Account)
                .WithOne(p => p.Customer)
                .HasForeignKey<Customer>(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<CustomerTestResult>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("CustomerTestResult");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.IsLastest).HasColumnName("isLastest");
            entity.Property(e => e.MainQuizId).HasColumnName("mainQuizId");
            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeId");

            entity.HasOne(d => d.Customer).WithMany(p => p.CustomerTestResults)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.MainQuiz).WithMany(p => p.CustomerTestResults)
                .HasForeignKey(d => d.MainQuizId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.SkinType).WithMany(p => p.CustomerTestResults)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<MainQuiz>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("MainQuiz");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdAt");

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Order");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.OrderDate)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("orderDate");
            entity.Property(e => e.Status)
                .HasConversion<int>()
                .HasColumnName("status");
            entity.Property(e => e.TotalPrice)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("totalPrice");
            entity.Property(e => e.ShippingFee)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("shippingFee");
            entity.Property(e => e.DeliveryAddress)
                .HasColumnType("text")
                .HasColumnName("deliveryAddress");
            entity.Property(e => e.PaymentMethod)
                .HasColumnType("text")
                .HasColumnName("paymentMethod");
            entity.Property(e => e.TransactionId)
                .HasColumnType("text")
                .HasColumnName("transactionId");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("OrderItem");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Quantity)
                .HasDefaultValue(1)
                .HasColumnName("quantity");
            entity.Property(e => e.UnitPrice)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("unitPrice");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Product");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BrandId).HasColumnName("brandId");
            entity.Property(e => e.CategoryId).HasColumnName("categoryId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Gender)
                .HasConversion<int>()
                .HasColumnName("gender");
            entity.Property(e => e.Image)
                .HasMaxLength(500)
                .HasColumnName("image");
            entity.Property(e => e.Ingredient).HasColumnName("ingredient");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("price");
            entity.Property(e => e.Size)
                .HasColumnName("size");
            entity.Property(e => e.Sale)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("sale");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.Stock).HasColumnName("stock");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProductSkinType>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("ProductSkinType");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.RecommentedLevel).HasColumnName("recommentedLevel");
            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeId");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductSkinTypes)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.SkinType).WithMany(p => p.ProductSkinTypes)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("Question");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.SkinQuizId).HasColumnName("skinQuizId");

            entity.HasOne(d => d.SkinQuiz).WithMany(p => p.Questions)
                .HasForeignKey(d => d.SkinQuizId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<SkinCareRoutine>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("SkinCareRoutine");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeId");
            entity.Property(e => e.Time)
                .HasMaxLength(50)
                .HasColumnName("time");

            entity.HasOne(d => d.SkinType).WithMany(p => p.SkinCareRoutines)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<SkinCareStep>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("SkinCareStep");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryId).HasColumnName("categoryId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.RoutineId).HasColumnName("routineId");
            entity.Property(e => e.StepOrder).HasColumnName("stepOrder");

            entity.HasOne(d => d.Category).WithMany(p => p.SkinCareSteps)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Routine).WithMany(p => p.SkinCareSteps)
                .HasForeignKey(d => d.RoutineId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<SkinQuiz>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("SkinQuiz");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MainQuizId).HasColumnName("mainQuizId");
            entity.Property(e => e.SkinElement)
                .HasConversion<int>()
                .HasColumnName("skinElement");

            entity.HasOne(d => d.MainQuiz).WithMany(p => p.SkinQuizzes)
                .HasForeignKey(d => d.MainQuizId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<SkinType>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("SkinType");

            entity.HasIndex(e => e.Id).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Characteristics).HasColumnName("characteristics");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Symbol)
                .HasMaxLength(10)
                .HasColumnName("symbol");
        });
        
        modelBuilder.Entity<City>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<District>(entity =>
        {
            entity.HasIndex(e => new { e.Name, e.CityId }).IsUnique();

            entity.HasOne(d => d.City)
                .WithMany(c => c.Districts)
                .HasForeignKey(d => d.CityId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ShippingFee>(entity =>
        {
            entity.Property(e => e.Fee).HasColumnType("numeric(18,2)");
            entity.Property(e => e.LastUpdated)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(sf => sf.City)
                .WithMany()
                .HasForeignKey(sf => sf.CityId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(sf => sf.District)
                .WithMany()
                .HasForeignKey(sf => sf.DistrictId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasIndex(e => e.DistrictId).IsUnique();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
