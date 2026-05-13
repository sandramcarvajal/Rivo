namespace Rivo.Domain.Entities;

/// <summary>
/// Entidad RoutePassenger: tabla intermedia para relación N:M entre Route y User (pasajeros).
/// 
/// Decisiones de diseño:
/// - PK compuesta de (RouteId, PassengerId): expresivo, no surrogate key
/// - NO hereda de BaseEntity (no necesita Id, CreatedAt, etc.)
/// - JoinedAt: fecha/hora en que pasajero se confirmó (order de llegada)
/// - Permite calcular AvailableSeats: COUNT(RoutePassenger) < Route.TotalSeats
/// - UNIQUE (RouteId, PassengerId): un pasajero no puede estar 2x en misma ruta
/// </summary>
public class RoutePassenger
{
    /// <summary>ID de la ruta (parte de PK).</summary>
    public Guid RouteId { get; set; }

    /// <summary>ID del pasajero (parte de PK).</summary>
    public Guid PassengerId { get; set; }

    /// <summary>Cuándo se confirmó el pasajero en la ruta.</summary>
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    // === Navegaciones (EF Core) ===
    public Route Route { get; set; } = null!;

    public User Passenger { get; set; } = null!;
}
