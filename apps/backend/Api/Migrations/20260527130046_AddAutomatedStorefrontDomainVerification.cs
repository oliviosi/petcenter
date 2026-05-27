using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAutomatedStorefrontDomainVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_ativado_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_proxima_tentativa_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_ultima_tentativa_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_verificado_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_empresas_dominio_personalizado_proxima_tentativa_em",
                table: "empresas",
                column: "dominio_personalizado_proxima_tentativa_em");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_empresas_dominio_personalizado_proxima_tentativa_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ativado_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_proxima_tentativa_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_tentativa_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_verificado_em",
                table: "empresas");
        }
    }
}
