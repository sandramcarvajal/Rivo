using Microsoft.EntityFrameworkCore;
using Rivo.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// ==================== CONFIGURACIÓN DE SERVICIOS ====================

// 1. CORS: Permitir requests desde el frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("RivoPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://localhost:5173") // Vite y otros puertos locales
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// 2. ENTITY FRAMEWORK CORE + PostgreSQL
// Conexión a PostgreSQL configurada en appsettings.json
var connectionString = builder.Configuration.GetConnectionString("RivoDb")
    ?? throw new InvalidOperationException("Connection string 'RivoDb' not found in appsettings.json");

builder.Services.AddDbContext<RivoDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// 3. CONTROLADORES
builder.Services.AddControllers();

// 4. SWAGGER / OpenAPI (para documentación de API)
builder.Services.AddOpenApi();

// ==================== CONSTRUCCIÓN DE LA APLICACIÓN ====================
var app = builder.Build();

// ==================== CONFIGURACIÓN DEL PIPELINE HTTP ====================

// 1. Aplicar CORS
app.UseCors("RivoPolicy");

// 2. HTTPS Redirection (producción)
app.UseHttpsRedirection();

// 3. SWAGGER (solo en desarrollo)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 4. AUTORIZACIÓN
app.UseAuthentication();
app.UseAuthorization();

// 5. MAPEAR CONTROLADORES
app.MapControllers();

// 6. EJECUTAR LA APLICACIÓN
app.Run();
