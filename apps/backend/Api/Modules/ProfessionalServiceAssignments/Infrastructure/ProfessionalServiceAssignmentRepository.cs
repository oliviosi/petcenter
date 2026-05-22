using Api.Infrastructure.Persistence;
using Api.Modules.ProfessionalServiceAssignments.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.ProfessionalServiceAssignments.Infrastructure;

public class ProfessionalServiceAssignmentRepository : IProfessionalServiceAssignmentRepository
{
    private readonly AppDbContext _db;

    public ProfessionalServiceAssignmentRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(ProfessionalServiceAssignment assignment)
    {
        _db.ProfessionalServiceAssignments.Add(assignment);
        await _db.SaveChangesAsync();
    }

    public async Task<ProfessionalServiceAssignment?> GetByProfessionalAndServiceAsync(Guid empresaId, Guid professionalId, Guid serviceId) =>
        await _db.ProfessionalServiceAssignments
            .FirstOrDefaultAsync(a =>
                a.EmpresaId == empresaId
                && a.ProfessionalId == professionalId
                && a.ServiceId == serviceId);

    public async Task<bool> ExistsAsync(Guid empresaId, Guid professionalId, Guid serviceId) =>
        await _db.ProfessionalServiceAssignments.AnyAsync(a =>
            a.EmpresaId == empresaId
            && a.ProfessionalId == professionalId
            && a.ServiceId == serviceId);

    public async Task<List<ProfessionalServiceAssignment>> ListByProfessionalAsync(Guid empresaId, Guid professionalId) =>
        await _db.ProfessionalServiceAssignments.AsNoTracking()
            .Where(a => a.EmpresaId == empresaId && a.ProfessionalId == professionalId)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();

    public async Task<List<ProfessionalServiceAssignment>> ListByServiceAsync(Guid empresaId, Guid serviceId, Guid? professionalId = null)
    {
        var query = _db.ProfessionalServiceAssignments.AsNoTracking()
            .Where(a => a.EmpresaId == empresaId && a.ServiceId == serviceId);

        if (professionalId.HasValue)
            query = query.Where(a => a.ProfessionalId == professionalId.Value);

        return await query
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task DeleteAsync(ProfessionalServiceAssignment assignment)
    {
        _db.ProfessionalServiceAssignments.Remove(assignment);
        await _db.SaveChangesAsync();
    }
}
