using System.Collections.Generic;

namespace LoginServer.Model
{
    public class StudentListRes
    {
        public StudentListData data { get; set; }
        public string message { get; set; }
        public bool success { get; set; }
    }
}
