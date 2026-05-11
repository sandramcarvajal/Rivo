namespace Rivo.Domain.Entities;

/// <summary>
/// Entidad User: representa a un empleado de SyC (conductor o pasajero).
/// 
/// Decisiones de diseño:
/// - Email UNIQUE: cada usuario tiene un correo corporativo único
/// - Role: enum que almacena 'Driver' o 'Passenger'
/// - HasCompletedProfile: validación de onboarding antes de usar la app
/// - PasswordHash: no guardamos contraseñas en texto plano (seguridad)
/// - Hereda de BaseEntity para auditoría automática
/// </summary>
public class User : BaseEntity
{
    /// <summary>Email corporativo (debe ser único).</summary>
    public string Email { get; set; } = null!;

    /// <summary>Nombre completo del usuario.</summary>
    public string Name { get; set; } = null!;

    /// <summary>Rol del usuario: 'Driver' o 'Passenger'.</summary>
    public string Role { get; set; } = null!; // 'Driver' o 'Passenger'

    /// <summary>Documento nacional de identidad.</summary>
    public string? Cedula { get; set; }

    /// <summary>Número de teléfono móvil.</summary>
    public string? Celula { get; set; }

    /// <summary>Hash de contraseña (manejado por ASP.NET Identity).</summary>
    public string PasswordHash { get; set; } = null!;

    /// <summary>¿Completó el perfil durante onboarding?</summary>
    public bool HasCompletedProfile { get; set; } = false;

    // === Navegaciones (EF Core) ===
    
    /// <summary>Rutas que este usuario (conductor) ha creado.</summary>
    public ICollection<Route> CreatedRoutes { get; set; } = new List<Route>();

    /// <summary>Vehículo de este usuario (si es conductor).</summary>
    public Vehicle? Vehicle { get; set; }

    /// <summary>Solicitudes de viaje que este usuario (pasajero) ha hecho.</summary>
    public ICollection<RideRequest> RideRequests { get; set; } = new List<RideRequest>();

    /// <summary>Rutas en las que este usuario (pasajero) está confirmado.</summary>
    public ICollection<RoutePassenger> RoutePassengers { get; set; } = new List<RoutePassenger>();
}
