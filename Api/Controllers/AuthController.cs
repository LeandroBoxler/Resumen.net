using Microsoft.AspNetCore.Mvc;
using domain.Entities;
using domain.services;
using domain.UseCase;
using System.Threading.Tasks;
using domain.Types;
using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    public class RegisterDTO
    {
        [Required]
        public required string FirstName { get; set; }
    
        [Required]
        public required string LastName { get; set; }
    
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    
        [Required]
        public required string Password { get; set; }
    }

    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }

    private readonly IService<User> _service;
    private readonly ICryptoService _cryptoService;
    
    public AuthController(IService<User> service, ICryptoService cryptoService)
    {
        _service = service;
        _cryptoService= cryptoService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO request)
    {
        RegisterUseCase useCase = new RegisterUseCase(_service, _cryptoService);
        OperationResult result = await useCase.Execute(new ()
        {
            Email = request.Email,
            FirstName = request.FirstName,
            Password = request.Password,
            LastName = request.LastName
        });

        if (!result.IsSuccess)
        {
            return BadRequest(new {message=result.Error!.Message});
        }

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO request) 
    {
        LoginUseCase useCase = new LoginUseCase(_service, _cryptoService);
        OperationResult<string> result = await useCase.Execute(new ()
        {
            Email = request.Email,
            Password = request.Password
        });

        if (!result.IsSuccess)
        {
            return BadRequest(new {message=result.Error!.Message});
        }

        return Ok(result.Value);
    }

    [HttpPost("profile")]
    [Authorize]
    public async Task<IActionResult> Profile()
    {
        Guid userId = new Guid(User.FindFirst("id")?.Value ?? "");
        if (userId == Guid.Empty) return Unauthorized(new {message="User ID not found in token"});
        GetProfileUseCase useCase = new GetProfileUseCase(_service);
        OperationResult<SecureUser> result = await useCase.Execute(userId);

        if (!result.IsSuccess)
        {
            return BadRequest(new {message=result.Error!.Message});
        }

        return Ok(result.Value!);
    }
}