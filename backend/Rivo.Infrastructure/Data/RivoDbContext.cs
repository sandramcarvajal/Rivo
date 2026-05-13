using Microsoft.EntityFrameworkCore;
using Rivo.Domain.Entities;

namespace Rivo.Infrastructure.Data;

/// <summary>
/// DbContext principal de Rivo.
/// 
/// Responsabilidades:
/// - Mapear entidades a tablas PostgreSQL
/// - Configurar relaciones (FK, 1:N, N:M)
/// - Definir índices para performance
/// - Definir constraints para integridad
/// - Configurar value conversions (enums, etc.)
/// 
/// Por qué una clase separada para configuración:
/// - OnModelCreating es muy largo; mejor separar en métodos
/// - Reutilizable; podemos aplicar la misma configuración en tests
/// - Mantenible; cada configuración en su lugar
/// </summary>
public class RivoDbContext : DbContext
{
    public RivoDbContext(DbContextOptions<RivoDbContext> options) : base(options)
    {
    }

    // === DbSets: Tablas principales ===
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Vehicle> Vehicles { get; set; } = null!;
    public DbSet<Route> Routes { get; set; } = null!;
    public DbSet<RideRequest> RideRequests { get; set; } = null!;
    public DbSet<RoutePassenger> RoutePassengers { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplicar todas las configuraciones
        ConfigureUserEntity(modelBuilder);
        ConfigureVehicleEntity(modelBuilder);
        ConfigureRouteEntity(modelBuilder);
        ConfigureRideRequestEntity(modelBuilder);
        ConfigureRoutePassengerEntity(modelBuilder);
    }

    /// <summary>
    /// Configurar tabla Users.
    /// </summary>
    private void ConfigureUserEntity(ModelBuilder modelBuilder)
    {
        var userBuilder = modelBuilder.Entity<User>();

        // PK
        userBuilder.HasKey(u => u.Id);

        // Índices: Email es UNIQUE (búsqueda frecuente)
        userBuilder
            .HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("idx_user_email");

        // Propiedades requeridas
        userBuilder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        userBuilder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(255);

        userBuilder.Property(u => u.Role)
            .IsRequired()
            .HasMaxLength(50);

        userBuilder.Property(u => u.PasswordHash)
            .IsRequired();

        // Relaciones
        userBuilder
            .HasMany(u => u.CreatedRoutes)
            .WithOne(r => r.Driver)
            .HasForeignKey(r => r.DriverId)
            .OnDelete(DeleteBehavior.Cascade);

        userBuilder
            .HasOne(u => u.Vehicle)
            .WithOne(v => v.Driver)
            .HasForeignKey<Vehicle>(v => v.DriverId)
            .OnDelete(DeleteBehavior.Cascade);

        userBuilder
            .HasMany(u => u.RideRequests)
            .WithOne(rr => rr.Passenger)
            .HasForeignKey(rr => rr.PassengerId)
            .OnDelete(DeleteBehavior.Cascade);

        userBuilder
            .HasMany(u => u.RoutePassengers)
            .WithOne(rp => rp.Passenger)
            .HasForeignKey(rp => rp.PassengerId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    /// <summary>
    /// Configurar tabla Vehicles.
    /// </summary>
    private void ConfigureVehicleEntity(ModelBuilder modelBuilder)
    {
        var vehicleBuilder = modelBuilder.Entity<Vehicle>();

        // PK
        vehicleBuilder.HasKey(v => v.Id);

        // Índices: Plate es UNIQUE (identificador físico)
        vehicleBuilder
            .HasIndex(v => v.Plate)
            .IsUnique()
            .HasDatabaseName("idx_vehicle_plate");

        vehicleBuilder
            .HasIndex(v => v.DriverId)
            .HasDatabaseName("idx_vehicle_driver");

        // Propiedades requeridas
        vehicleBuilder.Property(v => v.Make)
            .IsRequired()
            .HasMaxLength(100);

        vehicleBuilder.Property(v => v.Model)
            .IsRequired()
            .HasMaxLength(100);

        vehicleBuilder.Property(v => v.Color)
            .IsRequired()
            .HasMaxLength(100);

        vehicleBuilder.Property(v => v.Plate)
            .IsRequired()
            .HasMaxLength(20);

        vehicleBuilder.Property(v => v.Capacity)
            .IsRequired();
    }

    /// <summary>
    /// Configurar tabla Routes.
    /// </summary>
    private void ConfigureRouteEntity(ModelBuilder modelBuilder)
    {
        var routeBuilder = modelBuilder.Entity<Route>();

        // PK
        routeBuilder.HasKey(r => r.Id);

        // Índices para búsquedas frecuentes
        routeBuilder
            .HasIndex(r => r.DriverId)
            .HasDatabaseName("idx_route_driver");

        routeBuilder
            .HasIndex(r => r.Origin)
            .HasDatabaseName("idx_route_origin");

        routeBuilder
            .HasIndex(r => r.Destination)
            .HasDatabaseName("idx_route_destination");

        routeBuilder
            .HasIndex(r => r.Date)
            .HasDatabaseName("idx_route_date");

        // Índice compuesto: Status + CreatedAt (búsquedas de rutas activas ordenadas)
        routeBuilder
            .HasIndex(r => new { r.Status, r.CreatedAt })
            .HasDatabaseName("idx_route_status_created");

        // Propiedades requeridas
        routeBuilder.Property(r => r.Origin)
            .IsRequired()
            .HasMaxLength(255);

        routeBuilder.Property(r => r.Destination)
            .IsRequired()
            .HasMaxLength(255);

        routeBuilder.Property(r => r.Price)
            .IsRequired()
            .HasPrecision(10, 2); // NUMERIC(10,2) en PostgreSQL

        routeBuilder.Property(r => r.Status)
            .IsRequired()
            .HasMaxLength(50);

        // Row version para optimistic concurrency
        routeBuilder.Property(r => r.RowVersion)
            .IsRowVersion();

        // Relaciones
        routeBuilder
            .HasOne(r => r.Driver)
            .WithMany(u => u.CreatedRoutes)
            .HasForeignKey(r => r.DriverId)
            .OnDelete(DeleteBehavior.Cascade);

        routeBuilder
            .HasOne(r => r.Vehicle)
            .WithMany()
            .HasForeignKey(r => r.VehicleId)
            .OnDelete(DeleteBehavior.Restrict); // No eliminar vehículos por referencia de ruta

        routeBuilder
            .HasMany(r => r.RoutePassengers)
            .WithOne(rp => rp.Route)
            .HasForeignKey(rp => rp.RouteId)
            .OnDelete(DeleteBehavior.Cascade);

        routeBuilder
            .HasMany(r => r.RideRequests)
            .WithOne(rr => rr.Route)
            .HasForeignKey(rr => rr.RouteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignorar propiedad calculada
        routeBuilder.Ignore(r => r.AvailableSeats);
    }

    /// <summary>
    /// Configurar tabla RideRequests.
    /// </summary>
    private void ConfigureRideRequestEntity(ModelBuilder modelBuilder)
    {
        var requestBuilder = modelBuilder.Entity<RideRequest>();

        // PK
        requestBuilder.HasKey(rr => rr.Id);

        // Índices
        requestBuilder
            .HasIndex(rr => new { rr.RouteId, rr.Status })
            .HasDatabaseName("idx_ride_request_route_status");

        requestBuilder
            .HasIndex(rr => new { rr.PassengerId, rr.Status })
            .HasDatabaseName("idx_ride_request_passenger_status");

        // UNIQUE (RouteId, PassengerId) para una sola solicitud pending por pasajero/ruta
        requestBuilder
            .HasIndex(rr => new { rr.RouteId, rr.PassengerId })
            .IsUnique()
            .HasDatabaseName("idx_ride_request_unique");

        // Propiedades
        requestBuilder.Property(rr => rr.Status)
            .IsRequired()
            .HasMaxLength(50);

        requestBuilder.Property(rr => rr.Notes)
            .HasMaxLength(500);

        // Relaciones: FK relacionan con Route y User
        // (configuradas desde Route y User)
    }

    /// <summary>
    /// Configurar tabla RoutePassengers (tabla intermedia N:M).
    /// </summary>
    private void ConfigureRoutePassengerEntity(ModelBuilder modelBuilder)
    {
        var rpBuilder = modelBuilder.Entity<RoutePassenger>();

        // PK compuesta: (RouteId, PassengerId)
        // Razón: La relación en sí es la identidad; no necesita Id separado
        rpBuilder.HasKey(rp => new { rp.RouteId, rp.PassengerId });

        // Índices para búsquedas por orden de llegada
        rpBuilder
            .HasIndex(rp => new { rp.RouteId, rp.JoinedAt })
            .HasDatabaseName("idx_route_passenger_joined");

        rpBuilder
            .HasIndex(rp => rp.PassengerId)
            .HasDatabaseName("idx_route_passenger_passenger");

        // Relaciones: FK relacionan con Route y User
        // (configuradas desde Route y User)
    }
}

