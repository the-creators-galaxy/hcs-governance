using Hashgraph;
using Hellang.Middleware.ProblemDetails;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Reflection;
using VotingStream;
using VotingStream.Mappers;
using VotingStream.Mirror;
using VotingStream.Services;
using VotingStreamServer.Services;

var internalLogCache = new LogCache();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails(setup =>
{
    setup.IncludeExceptionDetails = (ctx, env) => builder.Environment.IsDevelopment() || builder.Environment.IsStaging();

    setup.Map<VotingStreamException>(ProblemDetailsMapper.MapVotingStreamException);
    setup.Map<FormatException>(ProblemDetailsMapper.MapFormatException);
});

builder.Services.AddControllers();

builder.Services.AddSingleton<Clock>();
builder.Services.AddSingleton<VotingStreamConfiguration>();
builder.Services.AddSingleton(MirrorRestClientFactory);
builder.Services.AddSingleton(internalLogCache);
builder.Services.AddSingleton<TaskProcessor>();
builder.Services.AddSingleton<ProposalRegistry>();
builder.Services.AddSingleton<VotingStreamMonitor>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "HCS Voting Stream",
        Description = "HCS Voting Stream Monitoring API",
        Contact = new OpenApiContact
        {
            Name = "The Creator's Galaxy",
            Url = new Uri("https://www.creatorsgalaxyfoundation.com/")
        },
        License = new OpenApiLicense
        {
            Name = "MIT",
            Url = new Uri("https://mit-license.org/")
        }
    });
    options.MapType(typeof(Address), () => new OpenApiSchema
    {
        Type = "string",
        Example = new OpenApiString("0.0.0")
    });
    options.MapType(typeof(ConsensusTimeStamp), () => new OpenApiSchema
    {
        Type = "string",
        Example = new OpenApiString("000000000.000000000")
    });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowAnyOrigin();
    });
});

builder.Logging.AddProvider(new InternalLoggerProvider(internalLogCache));

var app = builder.Build();

await app.Services.GetRequiredService<VotingStreamConfiguration>().InitAsync(builder.Configuration);
app.Services.GetRequiredService<VotingStreamMonitor>().Start();

app.UseProblemDetails();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

MirrorRestClient MirrorRestClientFactory(IServiceProvider sp)
{
    return new MirrorRestClient(sp.GetRequiredService<VotingStreamConfiguration>().MirrorRest);
}
