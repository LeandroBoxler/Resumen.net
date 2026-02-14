using domain.Types;

namespace domain.services;

public class Entity
{
    public Guid Id { get; set; }
}

public interface ICryptoService
{
    public Task<OperationResult<string>> Hash(string text);
    public Task<OperationResult> CompareHash(string text, string hashedText);

    // Token validation
    public Task<OperationResult<string>> GenerateAccessJWT(Entity payload);
    public Task<OperationResult<Entity>> ParseAccessJWT(string payload);
}