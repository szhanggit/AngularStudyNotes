namespace LoginServer.Model
{
    public class Response<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public bool Success { get; set; }
        public Response()
        {
            
        }

        public Response(T data, string msg, bool success) 
        {
            Data = data;
            Message = msg;
            Success = success;
        }
    }
}
