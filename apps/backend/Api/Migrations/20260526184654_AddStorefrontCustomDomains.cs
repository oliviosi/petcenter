using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStorefrontCustomDomains : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ativo",
                table: "empresas",
                type: "character varying(253)",
                maxLength: 253,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_desejado",
                table: "empresas",
                type: "character varying(253)",
                maxLength: 253,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_status",
                table: "empresas",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultima_falha",
                table: "empresas",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_empresas_dominio_personalizado_ativo",
                table: "empresas",
                column: "dominio_personalizado_ativo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_empresas_dominio_personalizado_desejado",
                table: "empresas",
                column: "dominio_personalizado_desejado",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_empresas_dominio_personalizado_ativo",
                table: "empresas");

            migrationBuilder.DropIndex(
                name: "IX_empresas_dominio_personalizado_desejado",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ativo",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_desejado",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_status",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_falha",
                table: "empresas");
        }
    }
}
