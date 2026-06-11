using System.ComponentModel.DataAnnotations;

namespace LoginServer.Model
{
    public class UpdateStudentStatus
    {
        public int StudentId { get; set; }
        public int Status { get; set; }
    }
}
