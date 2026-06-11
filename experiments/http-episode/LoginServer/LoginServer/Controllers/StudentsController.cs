using LoginServer.Model;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Threading;
using System;
using System.Net.Http.Headers;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.AspNetCore.StaticFiles;
using System.Collections.Generic;

namespace LoginServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        public string FileName { get; set; }
        public string MediaType { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public byte[] Content { get; set; }

        public StudentsController()
        {
            
        }

        [EnableCors("CorsApi")]
        [HttpGet("byId")]
        public Student getStudent([FromQuery] int id)
        {
            /*   https://localhost:5001/api/Students/byId?id=7   */
            Student s = new Student { FirstName = "Tom", LastName = "Peterson", Gender = true, Grade = 3, Id = id };
            return s;
        }

        [EnableCors("CorsApi")]
        [HttpGet("{id}")]
        public Student getStudentById(int id)
        {
            /*      https://localhost:5001/api/Students/5     */
            Student s = new Student { FirstName = "Tom", LastName = "Peterson", Gender = true, Grade = 3, Id = id };
            return s;
        }

        [EnableCors("CorsApi")]
        [HttpGet("all")]
        public StudentListRes getAllStudents()
        {
            Thread.Sleep(2000);
            StudentListRes studentListRes = new StudentListRes();
            studentListRes.data = new StudentListData();
            studentListRes.data.totalCount = 10;
            studentListRes.data.studentDtos = new List<Student> {
                new Student { FirstName="F0", LastName="L0", Gender = true, Grade = 1, Id = 100 },
                new Student { FirstName="F1", LastName="L1", Gender = true, Grade = 1, Id = 101 },
                new Student { FirstName="F2", LastName="L2", Gender = true, Grade = 1, Id = 102 },
                new Student { FirstName="F3", LastName="L3", Gender = true, Grade = 1, Id = 103 },
                new Student { FirstName="F4", LastName="L4", Gender = true, Grade = 1, Id = 104 },
                new Student { FirstName="F5", LastName="L5", Gender = true, Grade = 1, Id = 105 },
                new Student { FirstName="F6", LastName="L6", Gender = true, Grade = 1, Id = 106 },
                new Student { FirstName="F7", LastName="L7", Gender = true, Grade = 1, Id = 107 },
                new Student { FirstName="F8", LastName="L8", Gender = true, Grade = 1, Id = 108 },
                new Student { FirstName="F9", LastName="L9", Gender = true, Grade = 1, Id = 109 },
            };
            studentListRes.message = "Success";
            studentListRes.success = true;

            return studentListRes;
        }

        [EnableCors("CorsApi")]
        [HttpGet("good")]
        public StudentListRes getAllGoodStudents()
        {
            Thread.Sleep(2000);
            StudentListRes studentListRes = new StudentListRes();
            studentListRes.data = new StudentListData();
            studentListRes.data.totalCount = 10;
            studentListRes.data.studentDtos = new List<Student> {
                new Student { FirstName="G0", LastName="G0", Gender = true, Grade = 1, Id = 100 },
                new Student { FirstName="G1", LastName="G1", Gender = true, Grade = 1, Id = 101 },
                new Student { FirstName="G2", LastName="G2", Gender = true, Grade = 1, Id = 102 },
                new Student { FirstName="G3", LastName="G3", Gender = true, Grade = 1, Id = 103 },
                new Student { FirstName="G4", LastName="G4", Gender = true, Grade = 1, Id = 104 },
                new Student { FirstName="G5", LastName="G5", Gender = true, Grade = 1, Id = 105 },
                new Student { FirstName="G6", LastName="G6", Gender = true, Grade = 1, Id = 106 },
                new Student { FirstName="G7", LastName="G7", Gender = true, Grade = 1, Id = 107 },
                new Student { FirstName="G8", LastName="G8", Gender = true, Grade = 1, Id = 108 },
                new Student { FirstName="G9", LastName="G9", Gender = true, Grade = 1, Id = 109 },
            };
            studentListRes.message = "Success";
            studentListRes.success = true;

            return studentListRes;
        }

        [EnableCors("CorsApi")]
        [HttpGet("grade1")]
        public List<Student> getGrade1Students()
        { 
            List<Student> studentList = new List<Student> { 
                new Student { FirstName="F0", LastName="L0", Gender = true, Grade = 1, Id = 100 }, 
                new Student { FirstName="F1", LastName="L1", Gender = true, Grade = 1, Id = 101 },
                new Student { FirstName="F2", LastName="L2", Gender = true, Grade = 1, Id = 102 },
                new Student { FirstName="F3", LastName="L3", Gender = true, Grade = 1, Id = 103 },
                new Student { FirstName="F4", LastName="L4", Gender = true, Grade = 1, Id = 104 },
                new Student { FirstName="F5", LastName="L5", Gender = true, Grade = 1, Id = 105 },
                new Student { FirstName="F6", LastName="L6", Gender = true, Grade = 1, Id = 106 },
                new Student { FirstName="F7", LastName="L7", Gender = true, Grade = 1, Id = 107 },
                new Student { FirstName="F8", LastName="L8", Gender = true, Grade = 1, Id = 108 },
                new Student { FirstName="F9", LastName="L9", Gender = true, Grade = 1, Id = 109 },
            };
            return studentList;
        }

        [EnableCors("CorsApi")]
        [HttpGet("grade2")]
        public List<Student> getGrade2Students()
        {
            List<Student> studentList = new List<Student> {
                new Student { FirstName="F10", LastName="L10", Gender = true, Grade = 1, Id = 110 },
                new Student { FirstName="F11", LastName="L11", Gender = true, Grade = 1, Id = 111 },
                new Student { FirstName="F12", LastName="L12", Gender = true, Grade = 1, Id = 112 },
                new Student { FirstName="F13", LastName="L13", Gender = true, Grade = 1, Id = 113 },
                new Student { FirstName="F14", LastName="L14", Gender = true, Grade = 1, Id = 114 },
                new Student { FirstName="F15", LastName="L15", Gender = true, Grade = 1, Id = 115 },
                new Student { FirstName="F16", LastName="L16", Gender = true, Grade = 1, Id = 116 },
                new Student { FirstName="F17", LastName="L17", Gender = true, Grade = 1, Id = 117 },
                new Student { FirstName="F18", LastName="L18", Gender = true, Grade = 1, Id = 118 },
                new Student { FirstName="F19", LastName="L19", Gender = true, Grade = 1, Id = 119 },
            };
            return studentList;
        }

        [EnableCors("CorsApi")]
        [HttpGet("grade3")]
        public List<Student> getGrade3Students()
        {
            List<Student> studentList = new List<Student> {
                new Student { FirstName="F20", LastName="L20", Gender = true, Grade = 1, Id = 120 },
                new Student { FirstName="F21", LastName="L21", Gender = true, Grade = 1, Id = 121 },
                new Student { FirstName="F22", LastName="L22", Gender = true, Grade = 1, Id = 122 },
                new Student { FirstName="F23", LastName="L23", Gender = true, Grade = 1, Id = 123 },
                new Student { FirstName="F24", LastName="L24", Gender = true, Grade = 1, Id = 124 },
                new Student { FirstName="F25", LastName="L25", Gender = true, Grade = 1, Id = 125 },
                new Student { FirstName="F26", LastName="L26", Gender = true, Grade = 1, Id = 126 },
                new Student { FirstName="F27", LastName="L27", Gender = true, Grade = 1, Id = 127 },
                new Student { FirstName="F28", LastName="L28", Gender = true, Grade = 1, Id = 128 },
                new Student { FirstName="F29", LastName="L29", Gender = true, Grade = 1, Id = 129 },
            };
            return studentList;
        }

        [EnableCors("CorsApi")]
        [HttpGet("grade4")]
        public List<Student> getGrade4Students()
        {
            List<Student> studentList = new List<Student> {
                new Student { FirstName="F30", LastName="L30", Gender = true, Grade = 1, Id = 130 },
                new Student { FirstName="F31", LastName="L31", Gender = true, Grade = 1, Id = 131 },
                new Student { FirstName="F32", LastName="L32", Gender = true, Grade = 1, Id = 132 },
                new Student { FirstName="F33", LastName="L33", Gender = true, Grade = 1, Id = 133 },
                new Student { FirstName="F34", LastName="L34", Gender = true, Grade = 1, Id = 134 },
                new Student { FirstName="F35", LastName="L35", Gender = true, Grade = 1, Id = 135 },
                new Student { FirstName="F36", LastName="L36", Gender = true, Grade = 1, Id = 136 },
                new Student { FirstName="F37", LastName="L37", Gender = true, Grade = 1, Id = 137 },
                new Student { FirstName="F38", LastName="L38", Gender = true, Grade = 1, Id = 138 },
                new Student { FirstName="F39", LastName="L39", Gender = true, Grade = 1, Id = 139 },
            };
            return studentList;
        }

        [EnableCors("CorsApi")]
        [HttpGet("grade5")]
        public List<Student> getGrade5Students()
        {
            List<Student> studentList = new List<Student> {
                new Student { FirstName="F40", LastName="L40", Gender = true, Grade = 1, Id = 140 },
                new Student { FirstName="F41", LastName="L41", Gender = true, Grade = 1, Id = 141 },
                new Student { FirstName="F42", LastName="L42", Gender = true, Grade = 1, Id = 142 },
                new Student { FirstName="F43", LastName="L43", Gender = true, Grade = 1, Id = 143 },
                new Student { FirstName="F44", LastName="L44", Gender = true, Grade = 1, Id = 144 },
                new Student { FirstName="F45", LastName="L45", Gender = true, Grade = 1, Id = 145 },
                new Student { FirstName="F46", LastName="L46", Gender = true, Grade = 1, Id = 146 },
                new Student { FirstName="F47", LastName="L47", Gender = true, Grade = 1, Id = 147 },
                new Student { FirstName="F48", LastName="L48", Gender = true, Grade = 1, Id = 148 },
                new Student { FirstName="F49", LastName="L49", Gender = true, Grade = 1, Id = 149 },
            };
            return studentList;
        }

        [EnableCors("CorsApi")]
        [HttpPost]
        public Student RegisterStudent([FromBody] Student request)
        {
            request.Id = 100;
            return request;
        }

        [EnableCors("CorsApi")]
        [HttpPut]
        public Student EditStudent([FromBody] Student request)
        {
            request.FirstName = "SomeFirstName";
            request.LastName = "SomeLastName";
            request.Grade = 3;
            request.Gender = true;
            return request;
        }

        [EnableCors("CorsApi")]
        [HttpDelete]
        public bool DeleteStudent([FromQuery] int studentId)
        {
            return true;
        }

        [EnableCors("CorsApi")]
        [HttpGet]
        [Route("DownloadFile")]
        public async Task<IActionResult> DownloadFile(string filename)
        {
            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filepath, out var contenttype))
            {
                contenttype = "application/octet-stream";
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(filepath);
            return File(bytes, contenttype, Path.GetFileName(filepath));
        }


        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "";
            try
            {
                var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                filename = DateTime.Now.Ticks.ToString() + extension;

                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files");

                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }

                var exactpath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);
                using (var stream = new FileStream(exactpath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return filename;

            }
            catch (Exception ex)
            {
            }
            return filename;
        }

        [EnableCors("CorsApi")]
        [HttpPost]
        [Route("UploadFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadFile(IFormFile file, CancellationToken cancellationtoken)
        {
            try
            {
                var result = await WriteFile(file);
                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [EnableCors("CorsApi")]
        [HttpPut("Status")]        
        public async Task<IActionResult> Put([FromForm] UpdateStudentStatus update, CancellationToken cancellationToken)
        {
            Thread.Sleep(2000);
            Response<int> res = new Response<int>();
            res.Data = 0;
            res.Message = "Success";
            res.Success = true;
            return Ok(res);
        }

        [EnableCors("CorsApi")]
        [HttpPut("JsonStatus")]
        public async Task<IActionResult> Put2([FromBody] UpdateStudentStatus update, CancellationToken cancellationToken)
        {
            Thread.Sleep(2000);
            Response<int> res = new Response<int>();
            res.Data = 0;
            res.Message = "Success";
            res.Success = true;
            return Ok(res);
        }

    }
}
