using System.Security.Cryptography;
using domain.services;
using domain.Types;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

public class CryptoService : ICryptoService
{
    private readonly string JwtSecret;
    public CryptoService(IConfiguration configuration)
    {
        JwtSecret = configuration["JwtSecret"] ?? throw new Exception("JwtSecret not found in configuration");
    }

    public async Task<OperationResult> CompareHash(string text, string hashedText)
    {
        try
        {
            bool isEqual = await Task.Run(()=>BCrypt.Net.BCrypt.Verify(text, hashedText));

            if (!isEqual)
            {
                return new OperationResult(new Exception("Invalid credentials"));
            }

            return new OperationResult();
        }
        catch (Exception e)
        {
            return new OperationResult(e);
        }
    }

    public async Task<OperationResult<string>> Hash(string text)
    {
        try
        {
            string hashedText = await Task.Run(()=>BCrypt.Net.BCrypt.HashPassword(text));
            return new OperationResult<string>(hashedText);
        }
        catch (Exception e)
        {
            return new OperationResult<string>(e);
        }
    }

    public async Task<OperationResult<string>> GenerateAccessJWT(Entity payload)
    {
        try
        {
            string jwt = await Task.Run<string>(()=>
            {
                
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(JwtSecret);

            var claims = new List<Claim>
            {
                new Claim("id", payload.Id.ToString()),
                // Agrega más claims según tu Entity
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);
            return jwt;
            });

            return new OperationResult<string>(jwt);
        }
        catch (Exception e)
        {
            return new OperationResult<string>(e);
        }
    }

    public async Task<OperationResult<Entity>> ParseAccessJWT(string jwt)
    {
        try
        {
            Entity entity = await Task.Run<Entity>(()=>
            {
                var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(JwtSecret);
    
            tokenHandler.ValidateToken(jwt, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);
    
            var jwtToken = (JwtSecurityToken)validatedToken;
            var id = jwtToken.Claims.First(x => x.Type == "id").Value;
    
            // Reconstruye tu Entity según los claims
            var entity = new Entity { Id = Guid.Parse(id) };
            return entity;
            });
            return new OperationResult<Entity>(entity);
        }
        catch (Exception e)
        {
            return new OperationResult<Entity>(e);
        }
    }
}