using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoginServer.Model
{
    public class User
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string name { get; set; }
        public string token { get; set; }
        public string email { get; set; }
        public string avatar { get; set; }
        public string location { get; set; }
        public string title { get; set; }
    }
}
