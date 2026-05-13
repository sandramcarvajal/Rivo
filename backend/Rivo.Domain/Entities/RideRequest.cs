namespace Rivo.Domain.Entities;

/// <summary>
/// Entidad RideRequest: solicitud de un pasajero para unirse a una ruta.
/// 
/// Decisiones de diseño:
/// - Status es máquina de estados: Pending → (Accepted OR Rejected)
/// - UNIQUE (RouteId, PassengerId): un pasajero solo puede solicitar UNA VEZ por ruta
/// - RespondedAt es nullable: null si aún Pending, fecha si respondida
/// - Notes: razón de rechazo (feedback al pasajero)
/// </summary>
public class RideRequest : BaseEntity
{
    /// <summary>ID de la ruta a la que el pasajero quiere unirse.</summary>
    public Guid RouteId { get; set; }

    /// <summary>ID del pasajero que solicita.</summary>
    public Guid PassengerId { get; set; }

    /// <summary>
    /// Estado de la solicitud: 'Pending', 'Accepted', 'Rejected'.
    /// Máquina de estados: Pending → (Accepted OR Rejected).
    /// </summary>
    public string Status { get; set; } = "Pending";

    /// <summary>Fecha/hora en que se solicita.</summary>
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Fecha/hora en que conductor responde (null si Pending).</summary>
    public DateTime? RespondedAt { get; set; }

    /// <summary>Notas adicionales (e.g., razón de rechazo).</summary>
    public string? Notes { get; set; }

    // === Navegaciones (EF Core) ===
    public Route Route { get; set; } = null!;

    public User Passenger { get; set; } = null!;
}
