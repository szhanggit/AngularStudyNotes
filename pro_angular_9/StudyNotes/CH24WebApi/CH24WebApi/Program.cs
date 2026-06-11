using CH24WebApi.Infrastructure;
using CH24WebApi.Service;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var currentEnvironment = builder.Environment;
const string CORS_NAME = "client_service_CORSE_NAME";
// Add services to the container.

builder.Services.AddCors(opt =>
{
    opt.AddPolicy(CORS_NAME, builder =>
    {
        builder.AllowAnyMethod();
        builder.AllowAnyHeader();
        builder.AllowAnyOrigin();
    });
});

builder.Services.AddSingleton<IDataService, DataService>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers(options => {
    options.OutputFormatters.Insert(0, new JsonpMediaTypeFormatter());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(CORS_NAME);
app.Run();
