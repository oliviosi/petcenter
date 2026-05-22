using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicPetshopDiscovery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "bairro",
                table: "empresas",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "cidade",
                table: "empresas",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "descricao",
                table: "empresas",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "publica",
                table: "empresas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "resumo_contato",
                table: "empresas",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "resumo_endereco",
                table: "empresas",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "slug",
                table: "empresas",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_empresas_slug",
                table: "empresas",
                column: "slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_empresas_slug",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "bairro",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "cidade",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "descricao",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "publica",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "resumo_contato",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "resumo_endereco",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "slug",
                table: "empresas");
        }
    }
}
