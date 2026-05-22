using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingFoundation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerContact = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PetName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    PetSpecies = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    SlotStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SlotEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    State = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RejectedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RejectionReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_bookings_empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bookings_profissionais_ProfessionalId",
                        column: x => x.ProfessionalId,
                        principalTable: "profissionais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bookings_servicos_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "servicos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "inbox_entries",
                columns: table => new
                {
                    MessageId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    EventName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inbox_entries", x => x.MessageId);
                });

            migrationBuilder.CreateTable(
                name: "professional_service_assignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_professional_service_assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_professional_service_assignments_empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_professional_service_assignments_profissionais_Professional~",
                        column: x => x.ProfessionalId,
                        principalTable: "profissionais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_professional_service_assignments_servicos_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "servicos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_EmpresaId_ProfessionalId_SlotStart_State",
                table: "bookings",
                columns: new[] { "EmpresaId", "ProfessionalId", "SlotStart", "State" });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_EmpresaId_ServiceId_SlotStart",
                table: "bookings",
                columns: new[] { "EmpresaId", "ServiceId", "SlotStart" });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_ProfessionalId",
                table: "bookings",
                column: "ProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_ServiceId",
                table: "bookings",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_professional_service_assignments_EmpresaId_ProfessionalId_S~",
                table: "professional_service_assignments",
                columns: new[] { "EmpresaId", "ProfessionalId", "ServiceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_professional_service_assignments_EmpresaId_ServiceId",
                table: "professional_service_assignments",
                columns: new[] { "EmpresaId", "ServiceId" });

            migrationBuilder.CreateIndex(
                name: "IX_professional_service_assignments_ProfessionalId",
                table: "professional_service_assignments",
                column: "ProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_professional_service_assignments_ServiceId",
                table: "professional_service_assignments",
                column: "ServiceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookings");

            migrationBuilder.DropTable(
                name: "inbox_entries");

            migrationBuilder.DropTable(
                name: "professional_service_assignments");
        }
    }
}
