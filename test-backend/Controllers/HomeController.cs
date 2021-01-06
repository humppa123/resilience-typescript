namespace test_backend.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    public sealed class HomeController : ControllerBase
    {
        [HttpGet("/favicon.ico")]
        public IActionResult Favicon()
        {
            return this.NoContent();
        }

        [HttpGet("/")]
        public IActionResult Get()
        {
            var response =
                "This is the backend for integration tests of the resilience-typescript NPM package. See https://www.npmjs.com/package/resilience-typescript";
            return this.Ok(response);
        }
    }
}