using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStorefrontDomainCertificateReadiness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_dns_status",
                table: "empresas",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "Removed");

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_https_pronto_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_tls_provisionamento_iniciado_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_tls_proxima_tentativa_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_tls_status",
                table: "empresas",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "NotStarted");

            migrationBuilder.AddColumn<string>(
                name: "dominio_personalizado_tls_ultima_falha",
                table: "empresas",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dominio_personalizado_tls_ultima_tentativa_em",
                table: "empresas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_empresas_dominio_personalizado_tls_proxima_tentativa_em",
                table: "empresas",
                column: "dominio_personalizado_tls_proxima_tentativa_em");

            migrationBuilder.Sql(
                """
                UPDATE empresas
                SET
                    dominio_personalizado_dns_status = CASE
                        WHEN dominio_personalizado_status = 'Removed' THEN 'Removed'
                        WHEN dominio_personalizado_status = 'PendingSetup' THEN 'PendingSetup'
                        WHEN dominio_personalizado_status = 'Verifying' THEN 'Verifying'
                        WHEN dominio_personalizado_status = 'Failed' THEN 'Failed'
                        WHEN dominio_personalizado_status = 'Active' THEN 'Verified'
                        ELSE 'Removed'
                    END,
                    dominio_personalizado_tls_status = CASE
                        WHEN dominio_personalizado_status = 'Active' THEN 'Ready'
                        ELSE 'NotStarted'
                    END,
                    dominio_personalizado_tls_provisionamento_iniciado_em = CASE
                        WHEN dominio_personalizado_status = 'Active' THEN dominio_personalizado_verificado_em
                        ELSE NULL
                    END,
                    dominio_personalizado_tls_ultima_tentativa_em = CASE
                        WHEN dominio_personalizado_status = 'Active' THEN dominio_personalizado_ativado_em
                        ELSE NULL
                    END,
                    dominio_personalizado_https_pronto_em = CASE
                        WHEN dominio_personalizado_status = 'Active' THEN dominio_personalizado_ativado_em
                        ELSE NULL
                    END;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_empresas_dominio_personalizado_tls_proxima_tentativa_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_dns_status",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_https_pronto_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_tls_provisionamento_iniciado_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_tls_proxima_tentativa_em",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_tls_status",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_tls_ultima_falha",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "dominio_personalizado_tls_ultima_tentativa_em",
                table: "empresas");
        }
    }
}
