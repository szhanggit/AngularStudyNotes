using System.Collections.Generic;

namespace LoginServer.Model
{
    public class StudentListData
    {
        public List<Student> studentDtos { get; set; }
        public int totalCount { get; set; }
    }
}
