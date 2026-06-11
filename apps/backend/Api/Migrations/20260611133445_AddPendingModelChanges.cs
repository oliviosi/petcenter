using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPendingModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultima_notificacao_categoria",
                table: "empresas",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_ultima_notificacao_enviada_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultima_notificacao_motivo",
                table: "empresas",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_ultima_notificacao_resultado",
                table: "empresas",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "dominio_personalizado_ultima_notificacao_tentativas",
                table: "empresas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "domain_notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    empresa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    reason = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    payload = table.Column<string>(type: "text", nullable: true),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    outcome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    attempts = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_domain_notifications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_domain_notifications_created_at",
                table: "domain_notifications",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_domain_notifications_empresa_id",
                table: "domain_notifications",
                column: "empresa_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "domain_notifications");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_categoria",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_enviada_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_ultima_notificacao_motivo",
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
