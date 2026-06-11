using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Web;

/*https://blog.csdn.net/qq_38671182/article/details/117220212*/
namespace CH24WebApi.Infrastructure
{
    public class JsonpMediaTypeFormatter : TextOutputFormatter
    {
        private static readonly MediaTypeHeaderValue JsonType = new MediaTypeHeaderValue("application/json");
        private static readonly MediaTypeHeaderValue JsType = new MediaTypeHeaderValue("application/javascript");
        private static readonly MediaTypeHeaderValue TextType = new MediaTypeHeaderValue("text/javascript");

        public JsonpMediaTypeFormatter()
        {
            SupportedMediaTypes.Add(JsonType);
            SupportedMediaTypes.Add(JsType);
            SupportedMediaTypes.Add(TextType);

            SupportedEncodings.Add(Encoding.UTF8);
            SupportedEncodings.Add(Encoding.Unicode);
        }

        public override bool CanWriteResult(OutputFormatterCanWriteContext context)
        {
            if (context.HttpContext.Request.Method != HttpMethods.Get)
            {
                return false;
            }

            string callback = HttpUtility.UrlDecode((string)context.HttpContext.Request.Query["callback"]);
            return !string.IsNullOrEmpty(callback);
        }

        public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            string callback = HttpUtility.UrlDecode((string)context.HttpContext.Request.Query["callback"]);

            var buffer = new StringBuilder();
            buffer.Append(callback);
            buffer.Append('(');
            buffer.Append(JsonSerializer.Serialize(context.Object));
            buffer.Append(')');

            await context.HttpContext.Response.WriteAsync(buffer.ToString(), selectedEncoding);
        }

    }
}
