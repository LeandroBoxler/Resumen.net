using domain.Entities;
using domain.Types;

namespace domain.services;
public interface StudyNotesServices<T>
{
    public Task<OperationResult<T>> GetById(Guid id);
    public Task<OperationResult<T[]>> GetAll();
    public Task<OperationResult> Create(T create);
    public Task<OperationResult> Update(T update);
    public Task<OperationResult> Delete(Guid id);
}