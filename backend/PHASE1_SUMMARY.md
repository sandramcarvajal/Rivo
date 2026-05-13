# 📊 Resumen de Fase 1: Backend Base

## ✅ Lo Que Hemos Completado

### 1️⃣ Estructura de Solución
```
Rivo.Backend/
├── Rivo.Api/                  ← Web API (Controllers, endpoints)
├── Rivo.Domain/               ← Dominio puro (Entities, Enums)
├── Rivo.Application/          ← Lógica (Services, DTOs, Commands)
├── Rivo.Infrastructure/       ← Datos (DbContext, Repositories)
├── Rivo.Shared/               ← Comunes (Constants, Helpers)
└── Rivo.slnx                  ← Solución .NET
```

**Decisión:** Clean Architecture con dependencias hacia adentro
- **Domain** puro (sin EF Core, sin HTTP)
- **Application** orquesta lógica
- **Infrastructure** implementa persistencia
- **API** expone endpoints

---

### 2️⃣ Entidades de Dominio

| Entidad | Propósito | Características |
|---------|-----------|-----------------|
| **User** | Empleado SyC | Email UNIQUE, Role (Driver/Passenger), HasCompletedProfile |
| **Vehicle** | Auto del conductor | Plate UNIQUE, Capacity, DriverId FK |
| **Route** | Ruta publicada | Status machine, AvailableSeats calculado, RowVersion |
| **RideRequest** | Solicitud pasajero | Status machine, UNIQUE (Route,Passenger) |
| **RoutePassenger** | Pasajeros confirmados | Tabla intermedia N:M, JoinedAt para orden |

**Decisión Clave:** AvailableSeats = TotalSeats - COUNT(RoutePassengers)
- ✅ No se almacena (single source of truth)
- ✅ Previene inconsistencias multiusuario
- ✅ Queryable con índices

---

### 3️⃣ DbContext Profesional

```csharp
// RivoDbContext.cs
- Configuración separada por entidad
- Índices optimizados para queries frecuentes
- Constraints para integridad
- Row version para concurrencia
- Relaciones 1:N, N:M correctas
```

**Índices Creados:**
```
- idx_user_email (UNIQUE)
- idx_vehicle_plate (UNIQUE)
- idx_route_driver, idx_route_origin, idx_route_date
- idx_ride_request_route_status (parcial)
- idx_route_passenger_joined (compuesto)
```

---

### 4️⃣ Configuración de Infraestructura

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "RivoDb": "Host=localhost;Port=5432;Database=rivo_db;..."
  },
  "Jwt": {
    "SecretKey": "...",
    "ExpirationMinutes": 60
  }
}
```

**Program.cs:**
```csharp
- CORS configurado para React (puerto 3000, 5173)
- EF Core + PostgreSQL
- Swagger/OpenAPI
- DI configurado
```

---

### 5️⃣ Estado Actual

```
✅ Estructura de proyectos
✅ Entidades de dominio
✅ DbContext con configuraciones
✅ appsettings.json
✅ Program.cs
✅ Compilación limpia (0 errores)
❌ Base de datos no creada
❌ Migraciones no ejecutadas
❌ DTOs
❌ Repositories
❌ Controllers
❌ JWT
```

---

## 🔄 Próximos Pasos (Fase 2)

### 1. Crear Base de Datos PostgreSQL
```bash
# Option A: Command line
createdb rivo_db

# Option B: Connection string
Host=localhost;Database=rivo_db;Username=postgres
```

### 2. Crear Primera Migración
```bash
cd Rivo.Backend
dotnet ef migrations add InitialCreate --project Rivo.Infrastructure --startup-project Rivo.Api
```

### 3. Aplicar Migración
```bash
dotnet ef database update --project Rivo.Infrastructure --startup-project Rivo.Api
```

### 4. Verificar Tablas en PostgreSQL
```sql
\dt  -- listar tablas
SELECT * FROM users;
```

---

## 🎯 Arquitectura Resumida

```
REQUEST HTTP
    ↓
Rivo.Api (Controller)
    ↓
Rivo.Application (Service/Command Handler)
    ↓
Rivo.Domain (Lógica de negocio)
    ↓
Rivo.Infrastructure (Repository → DbContext → PostgreSQL)
    ↓
RESPONSE JSON
```

**Ventajas:**
- ✅ Domain puro (testeable sin BD)
- ✅ Application independiente de web
- ✅ Infrastructure intercambiable
- ✅ Escalable para microservicios

---

## 📝 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `Domain/Entities/BaseEntity.cs` | Clase base con auditoría |
| `Domain/Entities/Route.cs` | Ruta (AvailableSeats calculado) |
| `Domain/Enums/DomainEnums.cs` | Máquinas de estado |
| `Infrastructure/Data/RivoDbContext.cs` | Mapeo de entidades a BD |
| `Api/appsettings.json` | Conexión PostgreSQL |
| `Api/Program.cs` | Configuración DI, EF Core |

---

## 🛡️ Seguridad Prevenida

| Problema | Solución Implementada |
|----------|---------------------|
| Overbooking | Índices, constraints, locks |
| Race conditions | Row version optimistic concurrency |
| Inconsistencias multiusuario | DbContext centralizado, transacciones |
| Duplicados | UNIQUE constraints |
| Datos borrados | Soft delete (IsActive) |

---

## 🧪 Verificar Estructura

```bash
# Desde Rivo.Backend
dotnet build              # Debe compilar sin errores
dotnet sln Rivo.slnx list # Listar proyectos
```

---

## ❓ Dudas Frecuentes

**P: ¿Por qué AvailableSeats no se almacena?**
R: Single source of truth. Si se almacena, puede desincronizar con RoutePassenger.

**P: ¿Qué es Row version?**
R: Detección de conflictos: si 2 procesos actualizan simultáneamente, uno falla y reintenta.

**P: ¿Por qué UUID en lugar de Int?**
R: Distribuído (sin SPOF), impredecible (seguridad), escalable (microservicios).

**P: ¿Cómo previene overbooking?**
R: Count real + transacciones + constraints. Imposible tener más pasajeros que asientos.

---

**Estado:** ✅ Backend base profesional, listo para migraciones
**Próximo:** Fase 2 - Migraciones y primera prueba con BD
