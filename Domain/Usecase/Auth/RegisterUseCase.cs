
using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;

public class RegisterUsecasePayload
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
    }

    
public class RegisterUseCase
{
    private readonly IService<User> _service;
    private readonly ICryptoService _cryptoService;

    public RegisterUseCase(IService<User> service, ICryptoService cryptoService)
    {
        _service = service;
        _cryptoService = cryptoService;
    }

    public async Task<OperationResult> Execute(RegisterUsecasePayload payload)
    {
        OperationResult<User> userResult = await _service.GetOne(
            new Query<User>() {
                Filters = new BaseFilter<User>()
                {
                    Field = nameof(User.Email), Value = payload.Email, Operator = FilterOperator.Eq
                }
            }
        ); 

        if (userResult.IsSuccess)
        {
            return new OperationResult(new Exception("User exists"));
        }

        OperationResult<string> hashedPasswordResult = await _cryptoService.Hash(payload.Password);

        if (!hashedPasswordResult.IsSuccess)
        {
            return new OperationResult(hashedPasswordResult.Error!);
        }

        return await _service.Create(new User(payload.FirstName, payload.LastName, payload.Email, hashedPasswordResult.Value!));
    }
}