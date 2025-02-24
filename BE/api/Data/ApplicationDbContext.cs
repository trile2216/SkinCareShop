using System;
using System.Collections.Generic;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace api.Data;

public partial class ApplicationDbContext : IdentityDbContext<ApplicationUser>
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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Account__3213E83F806BD309");

            entity.ToTable("Account");

            entity.HasIndex(e => e.Id, "UQ__Account__3213E83E33B4EFAC").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasConversion<int>()
                .HasColumnName("role");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .HasColumnName("userName");

            entity.HasOne(d => d.IdentityUser)
                .WithOne(p => p.Account)
                .HasForeignKey<Account>(d => d.IdentityUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Answer__3213E83F6E6AC687");

            entity.ToTable("Answer");

            entity.HasIndex(e => e.Id, "UQ__Answer__3213E83E564C8748").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.QuestionId).HasColumnName("questionId");
            entity.Property(e => e.Score)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("score");

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Answer__question__1BC821DD");
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Brand__3213E83F3D442866");

            entity.ToTable("Brand");

            entity.HasIndex(e => e.Id, "UQ__Brand__3213E83ED24F6355").IsUnique();

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
            entity.HasKey(e => e.Id).HasName("PK__Category__3213E83F729611B3");

            entity.ToTable("Category");

            entity.HasIndex(e => e.Id, "UQ__Category__3213E83EAE1518D6").IsUnique();

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
            entity.HasKey(e => e.Id).HasName("PK__Comment__3213E83F99856583");

            entity.ToTable("Comment");

            entity.HasIndex(e => e.Id, "UQ__Comment__3213E83EB508DD5A").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("createdAt");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Rating).HasColumnName("rating");

            entity.HasOne(d => d.Customer).WithMany(p => p.Comments)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comment__custome__22751F6C");

            entity.HasOne(d => d.Product).WithMany(p => p.Comments)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comment__product__2180FB33");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Customer__3213E83FAF24D837");

            entity.ToTable("Customer");

            entity.HasIndex(e => e.Id, "UQ__Customer__3213E83E3A954E6B").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .HasColumnName("address");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("lastName");
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("phone");

            entity.HasOne(d => d.Account)
                .WithOne(p => p.Customer)
                .HasForeignKey<Customer>(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Customer__accoun__123EB7A3");
        });

        modelBuilder.Entity<CustomerTestResult>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Customer__3213E83FD9E9DFC3");

            entity.ToTable("CustomerTestResult");

            entity.HasIndex(e => e.Id, "UQ__Customer__3213E83E8A24C5FC").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.IsLastest).HasColumnName("isLastest");
            entity.Property(e => e.MainQuizId).HasColumnName("mainQuizId");
            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeId");

            entity.HasOne(d => d.Customer).WithMany(p => p.CustomerTestResults)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CustomerT__custo__17F790F9");

            entity.HasOne(d => d.MainQuiz).WithMany(p => p.CustomerTestResults)
                .HasForeignKey(d => d.MainQuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CustomerT__mainQ__1CBC4616");

            entity.HasOne(d => d.SkinType).WithMany(p => p.CustomerTestResults)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CustomerT__skinT__1DB06A4F");
        });

        modelBuilder.Entity<MainQuiz>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MainQuiz__3213E83FFBB84394");

            entity.ToTable("MainQuiz");

            entity.HasIndex(e => e.Id, "UQ__MainQuiz__3213E83E0DC34298").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("createdAt");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Order__3213E83F883296A0");

            entity.ToTable("Order");

            entity.HasIndex(e => e.Id, "UQ__Order__3213E83EF9659273").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.OrderDate)
                .HasPrecision(0)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("orderDate");
            entity.Property(e => e.Status)
                .HasConversion<int>()
                .HasColumnName("status");
            entity.Property(e => e.TotalPrice)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("totalPrice");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__customerI__1332DBDC");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__OrderIte__3213E83F26D7FD96");

            entity.ToTable("OrderItem");

            entity.HasIndex(e => e.Id, "UQ__OrderIte__3213E83E40886CC7").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Quantity)
                .HasDefaultValue(1)
                .HasColumnName("quantity");
            entity.Property(e => e.UnitPrice)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("unitPrice");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderItem__order__14270015");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderItem__produ__151B244E");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Product__3213E83F0D08AB86");

            entity.ToTable("Product");

            entity.HasIndex(e => e.Id, "UQ__Product__3213E83E2759CED2").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BrandId).HasColumnName("brandId");
            entity.Property(e => e.CategoryId).HasColumnName("categoryId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Gender)
                .HasConversion<int>()
                .HasColumnName("gender");
            entity.Property(e => e.Image)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.Ingredient).HasColumnName("ingredient");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");
            entity.Property(e => e.Sale)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("sale");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.Stock).HasColumnName("stock");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Product__brandId__00200768");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Product__categor__160F4887");
        });

        modelBuilder.Entity<ProductSkinType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ProductS__3213E83F99824F49");

            entity.ToTable("ProductSkinType");

            entity.HasIndex(e => e.Id, "UQ__ProductS__3213E83E612CDE1B").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.RecommentedLevel).HasColumnName("recommentedLevel");
            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeId");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductSkinTypes)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductSk__produ__17036CC0");

            entity.HasOne(d => d.SkinType).WithMany(p => p.ProductSkinTypes)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductSk__skinT__18EBB532");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Question__3213E83F7EADEB24");

            entity.ToTable("Question");

            entity.HasIndex(e => e.Id, "UQ__Question__3213E83EF7879E5B").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.SkinQuizId).HasColumnName("skinQuizId");

            entity.HasOne(d => d.SkinQuiz).WithMany(p => p.Questions)
                .HasForeignKey(d => d.SkinQuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Question__skinQu__1AD3FDA4");
        });

        modelBuilder.Entity<SkinCareRoutine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SkinCare__3213E83FFBC37F3B");

            entity.ToTable("SkinCareRoutine");

            entity.HasIndex(e => e.Id, "UQ__SkinCare__3213E83E28434439").IsUnique();

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
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SkinCareR__skinT__1EA48E88");
        });

        modelBuilder.Entity<SkinCareStep>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SkinCare__3213E83FFA2FD6A0");

            entity.ToTable("SkinCareStep");

            entity.HasIndex(e => e.Id, "UQ__SkinCare__3213E83E71DA5401").IsUnique();

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
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SkinCareS__categ__1F98B2C1");

            entity.HasOne(d => d.Routine).WithMany(p => p.SkinCareSteps)
                .HasForeignKey(d => d.RoutineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SkinCareS__routi__208CD6FA");
        });

        modelBuilder.Entity<SkinQuiz>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SkinQuiz__3213E83F0917F69E");

            entity.ToTable("SkinQuiz");

            entity.HasIndex(e => e.Id, "UQ__SkinQuiz__3213E83E42D15025").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MainQuizId).HasColumnName("mainQuizId");
            entity.Property(e => e.Score)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("score");
            entity.Property(e => e.SkinElement)
            .HasConversion<int>()
            .HasColumnName("skinElement");

            entity.HasOne(d => d.MainQuiz).WithMany(p => p.SkinQuizzes)
                .HasForeignKey(d => d.MainQuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SkinQuiz__mainQu__19DFD96B");
        });

        modelBuilder.Entity<SkinType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SkinType__3213E83F6E89766C");

            entity.ToTable("SkinType");

            entity.HasIndex(e => e.Id, "UQ__SkinType__3213E83EC754E20E").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Characteristics).HasColumnName("characteristics");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Symbol)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("symbol");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
