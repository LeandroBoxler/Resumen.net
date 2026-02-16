using domain.services;
using domain.Entities;
using domain.Types;

namespace domain.UseCase;
public class GetProfileUseCase
{
    private readonly IService<User> _service;

    public GetProfileUseCase(IService<User> service)
    {
        _service = service;
    }

    public async Task<OperationResult<SecureUser>> Execute(Guid userId)
    {
        OperationResult<User> result = await _service.GetById(userId);
        if (!result.IsSuccess)
        {
            return new OperationResult<SecureUser>(result.Error!);
        }
        
        return new OperationResult<SecureUser>(User.ToSecureUser(result.Value!));
    }
}
