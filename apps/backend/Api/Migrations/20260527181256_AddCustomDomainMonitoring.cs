using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomDomainMonitoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "dominio_personalizado_canonico_revertido_para_fallback",
                table: "empresas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_proximo_monitoramento_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_ultimo_monitoramento_degradado_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultimo_monitoramento_degradado_motivo",
                table: "empresas",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_ultimo_monitoramento_saudavel_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_empresas_dominio_personalizado_proximo_monitoramento_em",
                table: "empresas",
                column: "dominio_personalizado_proximo_monitoramento_em");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_empresas_dominio_personalizado_proximo_monitoramento_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_canonico_revertido_para_fallback",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_proximo_monitoramento_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultimo_monitoramento_degradado_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultimo_monitoramento_degradado_motivo",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultimo_monitoramento_saudavel_em",
                table: "empresas");
        }
    }
}
