using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Brand",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Brand__3213E83F3D442866", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Category__3213E83F729611B3", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "MainQuiz",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    createdAt = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MainQuiz__3213E83FFBB84394", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "SkinType",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    symbol = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    characteristics = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SkinType__3213E83F6E89766C", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    role = table.Column<int>(type: "int", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IdentityUserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Account__3213E83F806BD309", x => x.id);
                    table.ForeignKey(
                        name: "FK_Account_AspNetUsers_IdentityUserId",
                        column: x => x.IdentityUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ingredient = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    image = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    gender = table.Column<int>(type: "int", nullable: true),
                    stock = table.Column<int>(type: "int", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    categoryId = table.Column<int>(type: "int", nullable: false),
                    brandId = table.Column<int>(type: "int", nullable: false),
                    sale = table.Column<decimal>(type: "decimal(10,2)", nullable: true, defaultValue: 0m),
                    price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    status = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Product__3213E83F0D08AB86", x => x.id);
                    table.ForeignKey(
                        name: "FK__Product__brandId__00200768",
                        column: x => x.brandId,
                        principalTable: "Brand",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Product__categor__160F4887",
                        column: x => x.categoryId,
                        principalTable: "Category",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "SkinQuiz",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    mainQuizId = table.Column<int>(type: "int", nullable: false),
                    score = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    skinElement = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SkinQuiz__3213E83F0917F69E", x => x.id);
                    table.ForeignKey(
                        name: "FK__SkinQuiz__mainQu__19DFD96B",
                        column: x => x.mainQuizId,
                        principalTable: "MainQuiz",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "SkinCareRoutine",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    skinTypeId = table.Column<int>(type: "int", nullable: false),
                    time = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SkinCare__3213E83FFBC37F3B", x => x.id);
                    table.ForeignKey(
                        name: "FK__SkinCareR__skinT__1EA48E88",
                        column: x => x.skinTypeId,
                        principalTable: "SkinType",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    firstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    lastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    phone = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    accountId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__3213E83FAF24D837", x => x.id);
                    table.ForeignKey(
                        name: "FK__Customer__accoun__123EB7A3",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "ProductSkinType",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    productId = table.Column<int>(type: "int", nullable: false),
                    skinTypeId = table.Column<int>(type: "int", nullable: false),
                    recommentedLevel = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ProductS__3213E83F99824F49", x => x.id);
                    table.ForeignKey(
                        name: "FK__ProductSk__produ__17036CC0",
                        column: x => x.productId,
                        principalTable: "Product",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__ProductSk__skinT__18EBB532",
                        column: x => x.skinTypeId,
                        principalTable: "SkinType",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Question",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    skinQuizId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Question__3213E83F7EADEB24", x => x.id);
                    table.ForeignKey(
                        name: "FK__Question__skinQu__1AD3FDA4",
                        column: x => x.skinQuizId,
                        principalTable: "SkinQuiz",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "SkinCareStep",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    stepOrder = table.Column<int>(type: "int", nullable: false),
                    categoryId = table.Column<int>(type: "int", nullable: false),
                    routineId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SkinCare__3213E83FFA2FD6A0", x => x.id);
                    table.ForeignKey(
                        name: "FK__SkinCareS__categ__1F98B2C1",
                        column: x => x.categoryId,
                        principalTable: "Category",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__SkinCareS__routi__208CD6FA",
                        column: x => x.routineId,
                        principalTable: "SkinCareRoutine",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    productId = table.Column<int>(type: "int", nullable: false),
                    customerId = table.Column<int>(type: "int", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Comment__3213E83F99856583", x => x.id);
                    table.ForeignKey(
                        name: "FK__Comment__custome__22751F6C",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Comment__product__2180FB33",
                        column: x => x.productId,
                        principalTable: "Product",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "CustomerTestResult",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customerId = table.Column<int>(type: "int", nullable: false),
                    mainQuizId = table.Column<int>(type: "int", nullable: false),
                    skinTypeId = table.Column<int>(type: "int", nullable: false),
                    isLastest = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__3213E83FD9E9DFC3", x => x.id);
                    table.ForeignKey(
                        name: "FK__CustomerT__custo__17F790F9",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__CustomerT__mainQ__1CBC4616",
                        column: x => x.mainQuizId,
                        principalTable: "MainQuiz",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__CustomerT__skinT__1DB06A4F",
                        column: x => x.skinTypeId,
                        principalTable: "SkinType",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customerId = table.Column<int>(type: "int", nullable: false),
                    totalPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    orderDate = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false, defaultValueSql: "(getdate())"),
                    status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Order__3213E83F883296A0", x => x.id);
                    table.ForeignKey(
                        name: "FK__Order__customerI__1332DBDC",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Answer",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    questionId = table.Column<int>(type: "int", nullable: false),
                    score = table.Column<decimal>(type: "decimal(4,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Answer__3213E83F6E6AC687", x => x.id);
                    table.ForeignKey(
                        name: "FK__Answer__question__1BC821DD",
                        column: x => x.questionId,
                        principalTable: "Question",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "OrderItem",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    orderId = table.Column<int>(type: "int", nullable: false),
                    productId = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    unitPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderIte__3213E83F26D7FD96", x => x.id);
                    table.ForeignKey(
                        name: "FK__OrderItem__order__14270015",
                        column: x => x.orderId,
                        principalTable: "Order",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__OrderItem__produ__151B244E",
                        column: x => x.productId,
                        principalTable: "Product",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_IdentityUserId",
                table: "Account",
                column: "IdentityUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Account__3213E83E33B4EFAC",
                table: "Account",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Answer_questionId",
                table: "Answer",
                column: "questionId");

            migrationBuilder.CreateIndex(
                name: "UQ__Answer__3213E83E564C8748",
                table: "Answer",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__Brand__3213E83ED24F6355",
                table: "Brand",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Category__3213E83EAE1518D6",
                table: "Category",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comment_customerId",
                table: "Comment",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_productId",
                table: "Comment",
                column: "productId");

            migrationBuilder.CreateIndex(
                name: "UQ__Comment__3213E83EB508DD5A",
                table: "Comment",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_accountId",
                table: "Customer",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__3213E83E3A954E6B",
                table: "Customer",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerTestResult_customerId",
                table: "CustomerTestResult",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerTestResult_mainQuizId",
                table: "CustomerTestResult",
                column: "mainQuizId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerTestResult_skinTypeId",
                table: "CustomerTestResult",
                column: "skinTypeId");

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__3213E83E8A24C5FC",
                table: "CustomerTestResult",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__MainQuiz__3213E83E0DC34298",
                table: "MainQuiz",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Order_customerId",
                table: "Order",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "UQ__Order__3213E83EF9659273",
                table: "Order",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_orderId",
                table: "OrderItem",
                column: "orderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_productId",
                table: "OrderItem",
                column: "productId");

            migrationBuilder.CreateIndex(
                name: "UQ__OrderIte__3213E83E40886CC7",
                table: "OrderItem",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Product_brandId",
                table: "Product",
                column: "brandId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_categoryId",
                table: "Product",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "UQ__Product__3213E83E2759CED2",
                table: "Product",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductSkinType_productId",
                table: "ProductSkinType",
                column: "productId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSkinType_skinTypeId",
                table: "ProductSkinType",
                column: "skinTypeId");

            migrationBuilder.CreateIndex(
                name: "UQ__ProductS__3213E83E612CDE1B",
                table: "ProductSkinType",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Question_skinQuizId",
                table: "Question",
                column: "skinQuizId");

            migrationBuilder.CreateIndex(
                name: "UQ__Question__3213E83EF7879E5B",
                table: "Question",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SkinCareRoutine_skinTypeId",
                table: "SkinCareRoutine",
                column: "skinTypeId");

            migrationBuilder.CreateIndex(
                name: "UQ__SkinCare__3213E83E28434439",
                table: "SkinCareRoutine",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SkinCareStep_categoryId",
                table: "SkinCareStep",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SkinCareStep_routineId",
                table: "SkinCareStep",
                column: "routineId");

            migrationBuilder.CreateIndex(
                name: "UQ__SkinCare__3213E83E71DA5401",
                table: "SkinCareStep",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SkinQuiz_mainQuizId",
                table: "SkinQuiz",
                column: "mainQuizId");

            migrationBuilder.CreateIndex(
                name: "UQ__SkinQuiz__3213E83E42D15025",
                table: "SkinQuiz",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__SkinType__3213E83EC754E20E",
                table: "SkinType",
                column: "id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Answer");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropTable(
                name: "CustomerTestResult");

            migrationBuilder.DropTable(
                name: "OrderItem");

            migrationBuilder.DropTable(
                name: "ProductSkinType");

            migrationBuilder.DropTable(
                name: "SkinCareStep");

            migrationBuilder.DropTable(
                name: "Question");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "SkinCareRoutine");

            migrationBuilder.DropTable(
                name: "SkinQuiz");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "Brand");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "SkinType");

            migrationBuilder.DropTable(
                name: "MainQuiz");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
