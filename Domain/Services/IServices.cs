using domain.Entities;
using domain.Types;

namespace domain.services;
public interface IService<T>
{
    public Task<OperationResult<T>> GetById(Guid id);
    public Task<OperationResult<T[]>> GetAll();
    public Task<OperationResult> Create(T create);
    public Task<OperationResult> Update(T update);
    public Task<OperationResult> Delete(Guid id);
    public Task<OperationResult<T[]>> GetMany(Query<T> query);
    public Task<OperationResult<T>> GetOne(Query<T> query);
}