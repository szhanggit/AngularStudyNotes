using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoginServer.Model
{
    public class LoginRequestDto
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}
