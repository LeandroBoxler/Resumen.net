using domain.Entities;
using domain.services;
using domain.Types;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class PostgreStudyNotesService : StudyNotesServices<StudyNote>
{
    private readonly AppDbContext _ctx;
    public PostgreStudyNotesService(AppDbContext ctx)
    {
        _ctx = ctx;        
    }
    
    public async Task<OperationResult> Create(StudyNote create)
    {
        try {
            await _ctx.StudyNotes.AddAsync(create);
            await _ctx.SaveChangesAsync();
            return new OperationResult();
        }
        catch (Exception ex)
        {
            return new OperationResult(ex);
        }
    }

    public async Task<OperationResult> Delete(Guid id)
    {
        try {
        var entity = await _ctx.StudyNotes.FindAsync(id);
            if (entity == null) return new OperationResult(new Exception("Not found"));
        _ctx.Remove(entity);
        await _ctx.SaveChangesAsync();
        
        return new OperationResult();
        }
        catch (Exception ex)
        {
            return new OperationResult(ex);
        }
    }

    public async Task<OperationResult<StudyNote[]>> GetAll()
    {
        try {
        var items = await _ctx.StudyNotes.ToArrayAsync();
        
        return new OperationResult<StudyNote[]>(items);

        }
        catch (Exception ex)
        {
            return new OperationResult<StudyNote[]>(ex);
        }
    }

    public async Task<OperationResult<StudyNote>> GetById(Guid id)
    {
        var item = await _ctx.StudyNotes.FindAsync(id);
            if (item == null) return new OperationResult<StudyNote>(new Exception("Not found"));
            return new OperationResult<StudyNote>(item);
    }

    public async Task<OperationResult> Update(StudyNote update)
    {
        try
        {
            var existing = await _ctx.StudyNotes.FindAsync(update.Id);
        if (existing == null) return new OperationResult(new Exception("Not found"));
        existing.Name = update.Name;
        _ctx.StudyNotes.Update(existing);
        await _ctx.SaveChangesAsync();
        return new OperationResult();
        }catch (Exception e)
        {
            return new OperationResult(e);
        }
    }
}