using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    public partial class AddCustomDomainNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultima_notificacao_categoria",
                table: "empresas",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultima_notificacao_motivo",
                table: "empresas",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_ultima_notificacao_enviada_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultima_notificacao_resultado",
                table: "empresas",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "dominio_personalizado_ultima_notificacao_tentativas",
                table: "empresas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_empresas_dominio_personalizado_ultima_notificacao_enviada_em",
                table: "empresas",
                column: "dominio_personalizado_ultima_notificacao_enviada_em");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_empresas_dominio_personalizado_ultima_notificacao_enviada_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_categoria",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_motivo",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_enviada_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_resultado",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_tentativas",
                table: "empresas");
        }
    }
}
