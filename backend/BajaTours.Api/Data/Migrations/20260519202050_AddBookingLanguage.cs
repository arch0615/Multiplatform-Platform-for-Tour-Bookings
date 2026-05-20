using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BajaTours.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingLanguage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Bookings",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "es");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "Bookings");
        }
    }
}
