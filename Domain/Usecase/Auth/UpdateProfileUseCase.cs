
using domain.Entities;
using domain.services;
using domain.Types;

namespace domain.UseCase;

public class UpdateProfileUsecasePayload
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
}

public class UpdateProfileUseCase
{
    private readonly IService<User> _service;

    public UpdateProfileUseCase(IService<User> service)
    {
        _service = service;
    }

    public async Task<OperationResult<User>> Execute(Guid userId, UpdateProfileUsecasePayload payload)
    {
        // Verificar si el usuario existe
        OperationResult<User> userResult = await _service.GetOne(
            new Query<User>() {
                Filters = new BaseFilter<User>()
                {
                    Field = nameof(User.Id), Value = userId, Operator = FilterOperator.Eq
                }
            }
        );

        if (!userResult.IsSuccess)
        {
            return new OperationResult<User>(new Exception("Usuario no encontrado"));
        }

        User user = userResult.Value!;

        // Verificar si el email ya está en uso por otro usuario
        if (user.Email != payload.Email)
        {
            OperationResult<User> emailCheckResult = await _service.GetOne(
                new Query<User>() {
                    Filters = new BaseFilter<User>()
                    {
                        Field = nameof(User.Email), Value = payload.Email, Operator = FilterOperator.Eq
                    }
                }
            );

            if (emailCheckResult.IsSuccess)
            {
                return new OperationResult<User>(new Exception("El email ya está en uso"));
            }
        }

        // Actualizar los datos del usuario
        user.FirstName = payload.FirstName;
        user.LastName = payload.LastName;
        user.Email = payload.Email;

        await _service.Update(user);
        return new OperationResult<User>(user);
    }
}
