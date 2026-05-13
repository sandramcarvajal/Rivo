namespace Rivo.Domain.Entities;

/// <summary>
/// Entidad Vehicle: información del vehículo de un conductor.
/// 
/// Decisiones de diseño:
/// - DriverId es clave foránea (cada vehículo pertenece a un conductor)
/// - Plate UNIQUE: la placa es identificador físico único
/// - Capacity: número de pasajeros que puede llevar
/// </summary>
public class Vehicle : BaseEntity
{
    /// <summary>ID del conductor propietario.</summary>
    public Guid DriverId { get; set; }

    /// <summary>Marca del vehículo (e.g., Mazda, Toyota).</summary>
    public string Make { get; set; } = null!;

    /// <summary>Modelo del vehículo (e.g., 3 Grand Touring).</summary>
    public string Model { get; set; } = null!;

    /// <summary>Color del vehículo.</summary>
    public string Color { get; set; } = null!;

    /// <summary>Placa del vehículo (identificador físico único).</summary>
    public string Plate { get; set; } = null!;

    /// <summary>Capacidad de pasajeros (incluyendo conductor).</summary>
    public int Capacity { get; set; }

    // === Navegaciones (EF Core) ===
    public User Driver { get; set; } = null!;
}
