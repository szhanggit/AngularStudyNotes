using CH24WebApi.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CH24WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private string _name = "sa";
        private string _password = "secret";
        private string _token = "kljadhfklahsfklhkjsdf";
        private Response _response = null;
        public LoginController()
        {
            _response = new Response();
        }

        [HttpPost]
        public IActionResult Login(Account account)
        {
            if (account.Name == _name && account.Password == _password)
            {
                _response.Success = true;
                _response.Token = _token;
                return Ok(_response);
            }
            else
            {
                _response.Success = false;
                return BadRequest(_response);
            }
        }
    }
}
