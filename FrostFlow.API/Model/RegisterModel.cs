namespace TestReactAuth.Api.Model
{
    public class RegisterModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? ConfirmPassword { get; set; }
    }
}
