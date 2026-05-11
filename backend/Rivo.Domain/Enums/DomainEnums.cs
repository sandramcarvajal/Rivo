namespace Rivo.Domain.Enums;

/// <summary>
/// Estados posibles de una ruta.
/// 
/// Máquina de estados:
/// Active → Completed OR Cancelled
/// 
/// NO permitir transiciones reversas (e.g., Completed → Active).
/// </summary>
public enum RouteStatus
{
    /// <summary>Ruta activa, aceptando pasajeros.</summary>
    Active = 0,

    /// <summary>Ruta completada (viaje terminó).</summary>
    Completed = 1,

    /// <summary>Ruta cancelada.</summary>
    Cancelled = 2
}

/// <summary>
/// Estados posibles de una solicitud de viaje.
/// 
/// Máquina de estados:
/// Pending → Accepted OR Rejected
/// </summary>
public enum RideRequestStatus
{
    /// <summary>Solicitud en espera de respuesta del conductor.</summary>
    Pending = 0,

    /// <summary>Conductor aceptó la solicitud.</summary>
    Accepted = 1,

    /// <summary>Conductor rechazó la solicitud.</summary>
    Rejected = 2
}

/// <summary>
/// Roles de usuario en el sistema.
/// </summary>
public enum UserRole
{
    /// <summary>Conductor: publica rutas.</summary>
    Driver = 0,

    /// <summary>Pasajero: solicita unirse a rutas.</summary>
    Passenger = 1
}
