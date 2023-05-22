using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestReactAuth.Api.Migrations
{
    /// <inheritdoc />
    public partial class updatedColumnName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LeftAt",
                table: "ChatSessionUsers",
                newName: "LastOnline");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastOnline",
                table: "ChatSessionUsers",
                newName: "LeftAt");
        }
    }
}
