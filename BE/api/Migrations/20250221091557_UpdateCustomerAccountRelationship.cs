using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCustomerAccountRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customer_accountId",
                table: "Customer");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_accountId",
                table: "Customer",
                column: "accountId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customer_accountId",
                table: "Customer");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_accountId",
                table: "Customer",
                column: "accountId");
        }
    }
}
