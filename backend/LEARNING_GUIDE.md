# 🎓 Guía de Arquitectura Backend de Rivo

Esta guía explica la arquitectura del backend de Rivo y te ayuda a comprender cómo se construye un sistema profesional con **ASP.NET Core**, **Entity Framework Core** y **PostgreSQL**.

---

## 1. Propósito de esta Guía

Rivo es una app de movilidad compartida diseñada para resolver problemas multiusuario reales:
- Publicación de rutas por conductores
- Solicitudes de pasajeros
- Gestión de cupos
- Sincronización entre usuarios
- Prevención de inconsistencias y overbooking

El backend es la fuente de verdad. Aquí verás cómo se organiza y cómo fluye la información.

---

## 2. Arquitectura General

### Diagrama de capas

```text
HTTP Request
    ↓
Rivo.Api (Controllers, middleware)
    ↓
Rivo.Application (Commands, queries, servicios)
    ↓
Rivo.Domain (Entidades, reglas de negocio)
    ↓
Rivo.Infrastructure (DbContext, repositorios, PostgreSQL)
```

### Principios clave

- **Clean Architecture**: cada capa tiene responsabilidad única.
- **Dependencias hacia adentro**: API depende de Application, Application depende de Domain, Infrastructure depende de Domain.
- **SOLID**: responsabilidades claras, inyección de dependencias y separación de preocupaciones.
- **Backend como fuente de verdad**: la base de datos centralizada evita inconsistencias que el frontend no puede resolver.

---

## 3. Estructura de Carpetas

### `Rivo.Api`
- **Propósito**: exponer API REST y manejar requests/sesiones.
- **Contenido**:
  - `Controllers/`
  - `Middleware/`
  - `Extensions/`
  - `Program.cs`
  - `appsettings.json`

### `Rivo.Application`
- **Propósito**: orquestar lógica de negocio usando casos de uso.
- **Contenido**:
  - `Commands/` y `Queries/`
  - `DTOs/`
  - `Services/`
  - `Interfaces/`
  - `Validators/`

### `Rivo.Domain`
- **Propósito**: contener el modelo de dominio puro.
- **Contenido**:
  - `Entities/`
  - `Enums/`
  - `Interfaces/`
  - `Exceptions/`

### `Rivo.Infrastructure`
- **Propósito**: implementar acceso a datos y detalles técnicos.
- **Contenido**:
  - `Data/RivoDbContext.cs`
  - `Repositories/`
  - `Migrations/`
  - `Configuration/`

### `Rivo.Shared`
- **Propósito**: utilidades compartidas.
- **Contenido**:
  - `Constants/`
  - `Common/`

---

## 4. Flujo de Request Principal

### Ejemplo: un pasajero solicita unirse a una ruta

1. **Frontend** envía `POST /api/routes/{routeId}/join`.
2. **Rivo.Api** recibe el request en un controller.
3. El controller valida la forma y llama al caso de uso en **Application**.
4. **Application** ejecuta la lógica:
   - valida reglas de negocio
   - interpreta el comando
   - consulta repositorios
   - maneja errores y respuestas
5. **Infrastructure** persiste datos mediante `RivoDbContext`.
6. **PostgreSQL** realiza la transacción.
7. La respuesta retorna al frontend.

**Flujo clave:**
`HTTP → Controller → Application → Domain → Infrastructure → PostgreSQL`

---

## 5. Modelo de Dominio y Entidades

### Entidades principales

| Entidad | Propósito |
|---|---|
| `User` | Empleado SyC: conductor o pasajero |
| `Vehicle` | Vehículo del conductor |
| `Route` | Ruta publicada |
| `RideRequest` | Solicitud de viaje |
| `RoutePassenger` | Pasajero confirmado en ruta |

### Por qué estas entidades

- `User` representa identidad y roles.
- `Vehicle` mantiene datos de auto y capacidad.
- `Route` es la entidad central que modela disponibilidad y estado.
- `RideRequest` separa la solicitud del pasajero de la confirmación.
- `RoutePassenger` permite una relación N:M limpia y consistente.

---

## 6. Diseño Relacional en PostgreSQL

### Relaciones clave

- `User(Driver) 1:N Route`
- `User(Driver) 1:1 Vehicle`
- `Route 1:N RideRequest`
- `Route N:M User(Passenger)` mediante `RoutePassenger`

### ¿Por qué tabla intermedia `RoutePassenger`?

Porque una ruta puede tener varios pasajeros confirmados y un pasajero puede estar en varias rutas a lo largo del tiempo.

**Ventajas**:
- es queryable
- tiene índices eficientes
- permite campos adicionales como `JoinedAt`
- evita arrays en la tabla `Route`

---

## 7. Claves y Constraints Importantes

### Llaves primarias

- Usamos `Guid` (UUID) para `Id`.
- **Por qué**:
  - no predecible
  - escalable para sistemas distribuidos
  - evita conflictos en replicación

### Llaves foráneas

- `Route.DriverId → User.Id`
- `Vehicle.DriverId → User.Id`
- `RideRequest.RouteId → Route.Id`
- `RideRequest.PassengerId → User.Id`
- `RoutePassenger.RouteId → Route.Id`
- `RoutePassenger.PassengerId → User.Id`

### Constraints de integridad

- `users.email` es `UNIQUE`.
- `vehicles.plate` es `UNIQUE`.
- `ride_requests` tiene `UNIQUE(route_id, passenger_id)`.
- `RoutePassenger` usa PK compuesta `(RouteId, PassengerId)`.
- `Route.Status` es validado como enum (`Active`, `Completed`, `Cancelled`).
- `RideRequest.Status` es validado como enum (`Pending`, `Accepted`, `Rejected`).

---

## 8. Estados del Sistema

### Ruta (`Route`)

- `Active` → ruta disponible.
- `Completed` → viaje terminado.
- `Cancelled` → ruta anulada.

**Regla:** no debe regresar a `Active` después de `Completed` o `Cancelled`.

### Solicitud (`RideRequest`)

- `Pending` → esperando respuesta.
- `Accepted` → pasajero confirmado.
- `Rejected` → solicitud denegada.

**Regla:** `Pending` solo puede transicionar a `Accepted` o `Rejected`.

---

## 9. Cómo Prevenir Inconsistencias Multiusuario

### Problema: datos aislados localmente

El frontend solo no puede garantizar que dos usuarios vean datos iguales. Por eso el backend centraliza:
- rutas
- solicitudes
- pasajeros confirmados
- estados de rutas

### Estrategias

- **Base de datos centralizada**: PostgreSQL es la única fuente de verdad.
- **Transacciones**: operaciones críticas se ejecutan de forma atómica.
- **Constraints**: la BD rechaza datos inválidos.
- **Optimistic concurrency**: `RowVersion` en `Route` detecta conflictos simultáneos.
- **Status machines**: estados válidos claros.

---

## 10. Prevención de Overbooking

### Clave de diseño

No almacenamos `AvailableSeats` en la tabla `Route`.

**Cálculo recomendado:**
```csharp
AvailableSeats = TotalSeats - RoutePassengers.Count;
```

### Por qué esto es mejor

- evita duplicar datos
- mantiene la fuente de verdad en `RoutePassenger`
- simplifica la lógica de disponibilidad
- reduce inconsistencias

### Ejemplo de validación

1. Leer ruta activa.
2. Contar pasajeros confirmados.
3. Comparar con `TotalSeats`.
4. Si la ruta está llena, rechazar la aceptación.

---

## 11. Configuración Inicial que Ya Está Listada

### `Rivo.Api/appsettings.json`
- conexión PostgreSQL
- configuración JWT base

### `Rivo.Api/Program.cs`
- registro de servicios
- CORS para frontend local
- EF Core con Npgsql
- Swagger/OpenAPI

### `Rivo.Infrastructure/Data/RivoDbContext.cs`
- configuración de entidades
- índices iniciales
- relaciones entre tablas
- row version para concurrency

---

## 12. Buenas Prácticas Implementadas

- **SRP**: cada clase tiene una sola responsabilidad.
- **DI**: la inyección de dependencias facilita pruebas y reemplazos.
- **No lógica de UI en backend**: el backend solo expone datos y casos de uso.
- **No lógica de datos en el frontend**: el frontend consume el backend como fuente de verdad.
- **Logging y entornos**: `appsettings.json` separado del código.

---

## 13. Próxima Fase: Qué Construir Después

1. **Migraciones EF Core**:
   - `dotnet ef migrations add InitialCreate --project Rivo.Infrastructure --startup-project Rivo.Api`
   - `dotnet ef database update --project Rivo.Infrastructure --startup-project Rivo.Api`
2. **JWT Authentication**:
   - `AuthController`
   - `TokenService`
3. **DTOs y Mappers**:
   - `RouteDto`, `UserDto`, `RideRequestDto`
4. **Repositorios**:
   - `IRouteRepository`, `IUserRepository`
5. **Controllers**:
   - `RoutesController`, `UsersController`, `AuthController`
6. **Validaciones**:
   - FluentValidation para requests
7. **Tests**:
   - unitarios para dominio
   - de integración para DbContext

---

## 14. Cómo Usar Esta Guía

- Lee la sección de carpetas antes de tocar código.
- Revisa el flujo de request cuando implementes un nuevo endpoint.
- Usa `Domain` para reglas, `Application` para orquestar y `Infrastructure` para acceso a datos.
- Protege tu API con JWT y evita exponer detalles de BD.

---

## 15. Resumen Rápido

- La arquitectura es **estrictamente en capas**.
- `Domain` es el núcleo.
- `Application` aplica reglas.
- `Infrastructure` es la capa de datos.
- `Api` recibe y responde.
- PostgreSQL es la **fuente de verdad**.
- El diseño previene overbooking y mantiene consistencia.

---

## 16. Glosario Rápido

- **Clean Architecture**: separación clara de capas.
- **Domain**: modelo de negocio.
- **Application**: casos de uso.
- **Infrastructure**: persistencia.
- **DTO**: objeto para datos entre capas.
- **PK**: llave primaria.
- **FK**: llave foránea.
- **N:M**: relación muchos a muchos.

---

### Nota
Esta guía está pensada para que sigas construyendo de forma incremental. Cada sección explica por qué se toma una decisión, no solo qué se hace.


**Comparación:**

| Aspecto | Int | UUID |
|--------|-----|------|
| Tamaño | 4 bytes | 16 bytes |
| Predecible | ❌ 1, 2, 3... | ✅ Aleatorio |
| Distribuído | ❌ Requiere coordinación | ✅ Sin coordinación |
| Microservicios | ❌ Conflictos | ✅ Sin conflictos |
| Seguridad | ❌ Adivinar IDs | ✅ Imposible |

**Decisión:** UUID para producción, Int para prototipos

---

### 4. ¿Por qué AvailableSeats Calculado?

**Opción A: Almacenar en tabla**
```csharp
public class Route {
    public int AvailableSeats { get; set; }  // Columna en BD
}
```

**Problema:** Cuando pasajero se une, necesito actualizar dos cosas:
```sql
-- Opción A: Actualizar ambas
INSERT INTO route_passengers (...);
UPDATE routes SET available_seats = available_seats - 1 WHERE id = ?;
-- ❌ Dos operaciones = más chances de inconsistencia
```

**Opción B: Calcular dinámicamente (ELEGIDA)**
```csharp
[NotMapped]
public int AvailableSeats => TotalSeats - RoutePassengers.Count;
```

**Beneficio:** Single source of truth; si hay N pasajeros, cupos = total - N, punto.

---

## 🧪 Cómo Testear Esta Arquitectura

### Nivel 1: Unit Tests (Domain)
```csharp
// Sin BD, sin HTTP
[TestMethod]
public void Route_ShouldCalculateAvailableSeats() {
    // Arrange
    var route = new Route { TotalSeats = 4 };
    route.RoutePassengers.Add(new RoutePassenger { ... });
    
    // Act
    var available = route.AvailableSeats;
    
    // Assert
    Assert.AreEqual(3, available);  // 4 - 1 = 3
}
```

### Nivel 2: Integration Tests (Infrastructure)
```csharp
// Con BD real
[TestMethod]
public async Task JoinRoute_ShouldPreventOverbooking() {
    // Arrange
    using var context = new RivoDbContext(options);
    var route = new Route { TotalSeats = 1 };
    
    // Act & Assert
    await context.RoutePassengers.AddAsync(new RoutePassenger { ... });
    var exception = await Assert.ThrowsAsync<DbUpdateException>(...);
}
```

### Nivel 3: End-to-End Tests (HTTP)
```csharp
// Con servidor running
[TestMethod]
public async Task PostJoinRoute_ShouldReturn409_WhenFull() {
    // Arrange
    var client = new HttpClient();
    
    // Act
    var response = await client.PostAsync("/api/routes/123/join", ...);
    
    // Assert
    Assert.AreEqual(409, (int)response.StatusCode); // Conflict
}
```

---

## 🎓 Próximos Pasos de Aprendizaje

1. **Understand:** Lee DbContext y sus relaciones
2. **Create:** Escribe primera migración
3. **Test:** Verifica BD con queries SQL
4. **Implement:** Crea primer Repository
5. **Build:** Implementa primer Controller
6. **Learn:** Descubre patrón Repository

---

## 📚 Recursos para Profundizar

- **Clean Architecture:** [Uncle Bob Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- **EF Core:** [Microsoft Docs](https://learn.microsoft.com/ef/core/)
- **PostgreSQL:** [Official Docs](https://www.postgresql.org/docs/)
- **SOLID Principles:** [Wikipedia](https://en.wikipedia.org/wiki/SOLID)

---

**Conclusión:** La arquitectura está diseñada para que cada capa sea independiente, testeable y escalable. Domain no conoce BD; Infrastructure no conoce HTTP; API delega a Application. Esto es Clean Architecture en acción.

