# Rivo Backend - Estructura y Setup

## 📋 Descripción General

Backend profesional de Rivo desarrollado con **ASP.NET Core Web API**, **Entity Framework Core** y **PostgreSQL**, siguiendo **Clean Architecture** e implementando patrones SOLID.

---

## 🏗️ Arquitectura

```
Rivo.Backend/
├── Rivo.Api/               ← Presentación (Controllers, Middleware)
├── Rivo.Application/       ← Lógica de negocio (Commands, Queries, Services)
├── Rivo.Domain/            ← Reglas de dominio (Entities, Enums, Interfaces)
├── Rivo.Infrastructure/    ← Persistencia (DbContext, Repositories, EF Core)
└── Rivo.Shared/            ← Utilidades comunes (Constants, Helpers)
```

### Dependencias (Flujo hacia adentro):
```
API → Application → Domain ← Infrastructure
            ↓
          Shared
```

**Por qué esta estructura:**
- **Domain** contiene reglas de negocio puras, sin dependencias externas
- **Application** orquesta lógica usando comandos/queries
- **Infrastructure** implementa persistencia
- **API** expone endpoints REST
- **Shared** proporciona utilidades reutilizables

---

## 🗄️ Entidades de Base de Datos

### Diagrama Relacional

```
User (1)──────(N) Vehicle
 │                 
 ├──────(1──N)─→ Route
 │                 │
 │                 ├──(1──N)─→ RideRequest
 │                 └──(N─M)─→ RoutePassenger
 │
 ├──────(1──N)─→ RideRequest
 └──────(1──N)─→ RoutePassenger
```

### Tablas Principales

**users**
- `id` (UUID, PK)
- `email` (UNIQUE)
- `name`
- `role` ('Driver' o 'Passenger')
- `password_hash`
- `cedula`, `celula` (documentos)
- `has_completed_profile` (bool)
- `is_active` (soft delete)
- `created_at`, `updated_at`

**vehicles**
- `id` (UUID, PK)
- `driver_id` (FK → users)
- `make`, `model`, `color`
- `plate` (UNIQUE)
- `capacity`
- `created_at`, `updated_at`, `is_active`

**routes**
- `id` (UUID, PK)
- `driver_id` (FK → users)
- `vehicle_id` (FK → vehicles)
- `origin`, `destination`
- `date`, `time`
- `price` (NUMERIC 10,2)
- `total_seats`
- `status` ('Active', 'Completed', 'Cancelled')
- `row_version` (optimistic concurrency)
- `created_at`, `updated_at`, `is_active`

**ride_requests**
- `id` (UUID, PK)
- `route_id` (FK → routes)
- `passenger_id` (FK → users)
- `status` ('Pending', 'Accepted', 'Rejected')
- `requested_at`, `responded_at`
- `notes`
- `created_at`, `updated_at`, `is_active`

**route_passengers** (Tabla Intermedia N:M)
- `route_id` (FK → routes, parte de PK)
- `passenger_id` (FK → users, parte de PK)
- `joined_at`

---

## ⚙️ Configuración Inicial

### 1. Crear Base de Datos PostgreSQL

```bash
# Usando PostgreSQL
createdb rivo_db
```

O en psql:
```sql
CREATE DATABASE rivo_db;
```

### 2. Crear usuario PostgreSQL (opcional)

```sql
CREATE USER rivo_user WITH PASSWORD 'rivo_password';
GRANT ALL PRIVILEGES ON DATABASE rivo_db TO rivo_user;
```

### 3. Verificar appsettings.json

En `Rivo.Api/appsettings.json`, la conexión debe ser:
```json
"ConnectionStrings": {
    "RivoDb": "Host=localhost;Port=5432;Database=rivo_db;Username=rivo_user;Password=rivo_password;"
}
```

---

## 🔄 Migraciones de Entity Framework Core

### Crear Primera Migración

```bash
# Navegar a la carpeta del proyecto
cd Rivo.Backend

# Crear migración inicial
dotnet ef migrations add InitialCreate --project Rivo.Infrastructure --startup-project Rivo.Api

# La migración se crea en Rivo.Infrastructure/Migrations/
```

### Aplicar Migración a BD

```bash
# Aplicar migraciones pendientes
dotnet ef database update --project Rivo.Infrastructure --startup-project Rivo.Api

# La BD se crea y se generan todas las tablas
```

### Ver Migraciones Aplicadas

```bash
dotnet ef migrations list --project Rivo.Infrastructure --startup-project Rivo.Api
```

### Revertir Migración (si hay error)

```bash
dotnet ef database update <nombre-migración-anterior> --project Rivo.Infrastructure --startup-project Rivo.Api
```

---

## 🚀 Ejecutar el Backend

```bash
# Desde la carpeta raíz
cd Rivo.Backend

# Restaurar dependencias
dotnet restore

# Compilar
dotnet build

# Ejecutar
dotnet run --project Rivo.Api

# La API estará disponible en: https://localhost:5001 o http://localhost:5000
```

---

## 📚 Decisiones Arquitectónicas Importantes

### 1. UUID como PK
- ✅ Distribuído (sin SPOF)
- ✅ Seguridad (no secuencial)
- ✅ Escalable para microservicios

### 2. AvailableSeats Calculado
- `AvailableSeats = TotalSeats - COUNT(RoutePassengers)`
- ✅ Single source of truth
- ✅ Previene inconsistencias
- ❌ Queries más complejas (pero vale la pena)

### 3. Soft Delete (IsActive)
- ✅ Auditoría y compliance
- ✅ Datos nunca se pierden
- ✅ Recuperación fácil

### 4. RowVersion para Optimistic Concurrency
- ✅ Detecta conflictos en ediciones simultáneas
- ✅ Previene race conditions
- ❌ Reintentosrequeridos

### 5. Tabla Intermedia RoutePassenger
- ✅ Queryable e indexable
- ✅ Auditoría de llegada (JoinedAt)
- ✅ Escalable para datos adicionales (pickup, dropoff)

---

## 🔐 Seguridad (Próximos Pasos)

- [ ] JWT Authentication (Bearer tokens)
- [ ] Role-based Authorization (policies)
- [ ] HTTPS obligatorio (en producción)
- [ ] Rate limiting
- [ ] Input validation (FluentValidation)
- [ ] SQL injection prevention (EF Core previene)

---

## 📖 Recursos

- [Entity Framework Core Docs](https://learn.microsoft.com/en-us/ef/core/)
- [PostgreSQL Npgsql](https://www.npgsql.org/efcore/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## ✅ Checklist de Pasos Completados

- [x] Crear estructura de solución
- [x] Crear proyectos (Api, Domain, Application, Infrastructure, Shared)
- [x] Configurar referencias entre proyectos
- [x] Instalar EF Core + PostgreSQL
- [x] Crear entidades de dominio
- [x] Crear DbContext con configuraciones
- [x] Configurar appsettings.json
- [x] Actualizar Program.cs
- [ ] **Próximo: Crear primera migración y BD**
- [ ] JWT Authentication
- [ ] Crear DTOs
- [ ] Crear Repositories
- [ ] Crear Application Services
- [ ] Crear Controllers

