namespace Rivo.Domain.Entities;

/// <summary>
/// Entidad Route: una ruta publicada por un conductor.
/// 
/// Decisiones de diseño:
/// - AvailableSeats NO se almacena; se calcula dinámicamente: TotalSeats - COUNT(RoutePassengers)
/// - VehicleId captura el vehículo en momento de creación (auditoría histórica)
/// - RowVersion para optimistic concurrency (detectar conflictos)
/// - Status es una máquina de estados: Active → Completed/Cancelled (no reversible)
/// </summary>
public class Route : BaseEntity
{
    /// <summary>ID del conductor que crea la ruta.</summary>
    public Guid DriverId { get; set; }

    /// <summary>ID del vehículo usado en esta ruta (captura contexto histórico).</summary>
    public Guid VehicleId { get; set; }

    /// <summary>Ubicación de origen.</summary>
    public string Origin { get; set; } = null!;

    /// <summary>Ubicación de destino.</summary>
    public string Destination { get; set; } = null!;

    /// <summary>Fecha de la ruta.</summary>
    public DateOnly Date { get; set; }

    /// <summary>Hora de salida.</summary>
    public TimeOnly Time { get; set; }

    /// <summary>Precio por asiento (decimal para precisión monetaria).</summary>
    public decimal Price { get; set; }

    /// <summary>Capacidad total de pasajeros en esta ruta.</summary>
    public int TotalSeats { get; set; }

    /// <summary>
    /// Estado de la ruta: 'Active', 'Completed', 'Cancelled'.
    /// Máquina de estados: Active → (Completed OR Cancelled).
    /// No reverso permitido.
    /// </summary>
    public string Status { get; set; } = "Active";

    /// <summary>Cuándo comenzó el viaje real (opcional).</summary>
    public DateTime? StartedAt { get; set; }

    /// <summary>Cuándo finalizó el viaje (opcional).</summary>
    public DateTime? CompletedAt { get; set; }

    /// <summary>
    /// Row version para detección de conflictos concurrentes.
    /// EF Core lo maneja automáticamente.
    /// Si dos procesos modifican simultáneamente, uno recibe error.
    /// </summary>
    public byte[]? RowVersion { get; set; }

    // === Navegaciones (EF Core) ===
    public User Driver { get; set; } = null!;

    public Vehicle Vehicle { get; set; } = null!;

    /// <summary>Pasajeros confirmados en esta ruta.</summary>
    public ICollection<RoutePassenger> RoutePassengers { get; set; } = new List<RoutePassenger>();

    /// <summary>Solicitudes de pasajeros (pendientes, aceptadas, rechazadas).</summary>
    public ICollection<RideRequest> RideRequests { get; set; } = new List<RideRequest>();

    /// <summary>
    /// Propiedad calculada (no mapeada a BD).
    /// AvailableSeats = TotalSeats - RoutePassengers.Count
    /// Razón: Single source of truth; no duplicar información.
    /// </summary>
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public int AvailableSeats => TotalSeats - RoutePassengers.Count;
}
