using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;

public class LoginUsecasePayload
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }


public class LoginUseCase
{
    private readonly IService<User> _service;
    private readonly ICryptoService _cryptoService;

    public LoginUseCase(IService<User> service, ICryptoService cryptoService)
    {
        _service = service;
        _cryptoService = cryptoService;
    }

    public async Task<OperationResult<string>> Execute(LoginUsecasePayload payload)
    {
        OperationResult<User> userResult = await _service.GetOne(
            new Query<User>() {
                Filters = new BaseFilter<User>()
                {
                    Field = nameof(User.Email), Value = payload.Email, Operator = FilterOperator.Eq
                }
            }
        ); 

        if (!userResult.IsSuccess)
        {
            return new OperationResult<string>(new Exception("User not found"));
        }
        User user = userResult.Value!;

        OperationResult passwordMatches = await _cryptoService.CompareHash(payload.Password, user.HashedPassword);

        if (!passwordMatches.IsSuccess)
        {
            return new OperationResult<string>(new Exception("Invalid password"));
        }

        return await _cryptoService.GenerateAccessJWT(new () { Id = user.Id });
    }
}