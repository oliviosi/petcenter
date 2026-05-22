using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingFeedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FeedbackAccessTokenHash",
                table: "bookings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FeedbackSubmittedAt",
                table: "bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "booking_feedbacks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalRating = table.Column<int>(type: "integer", nullable: false),
                    PetshopRating = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_feedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_booking_feedbacks_bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_booking_feedbacks_empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_booking_feedbacks_profissionais_ProfessionalId",
                        column: x => x.ProfessionalId,
                        principalTable: "profissionais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_booking_feedbacks_BookingId",
                table: "booking_feedbacks",
                column: "BookingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_booking_feedbacks_EmpresaId",
                table: "booking_feedbacks",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_booking_feedbacks_ProfessionalId",
                table: "booking_feedbacks",
                column: "ProfessionalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "booking_feedbacks");

            migrationBuilder.DropColumn(
                name: "FeedbackAccessTokenHash",
                table: "bookings");

            migrationBuilder.DropColumn(
                name: "FeedbackSubmittedAt",
                table: "bookings");
        }
    }
}
