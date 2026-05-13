namespace Rivo.Domain.Entities;

/// <summary>
/// Clase base para todas las entidades del dominio.
/// Proporciona propiedades comunes de auditoría (CreatedAt, UpdatedAt).
/// Razón: Evitar duplicación; todas las entidades necesitan tracking.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Identificador único de la entidad (UUID).
    /// Razón: UUID es impredecible (seguridad) y distribuído (escalabilidad).
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Fecha de creación en UTC.
    /// Razón: Auditoría; saber cuándo se creó el registro.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Última fecha de actualización en UTC.
    /// Razón: Auditoría; saber cuándo se modificó por última vez.
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Soft delete: si es false, la entidad está lógicamente eliminada.
    /// Razón: Nunca borrar datos reales (requerimientos regulatorios, auditoría).
    /// </summary>
    public bool IsActive { get; set; } = true;
}
