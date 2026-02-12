# Ecomers - E-commerce Multi-plataforma

Proyecto de e-commerce con arquitectura multi-plataforma.

## Estructura del Proyecto

- **Domain/**: Capa de dominio en C# con entidades y lógica de negocio
- **Api/**: API REST en C# con ASP.NET Core
- **Web/**: Aplicación web con React y TypeScript
- **App/**: Aplicación móvil con Flutter

## Tecnologías

### Backend (C#)
- .NET 9.0
- Entity Framework Core
- PostgreSQL

### Web (React + TypeScript)
- React 18
- TypeScript
- Vite
- React Router
- Axios

### App (Flutter)
- Flutter 3.0+
- Dart 3.0+
- Dio (HTTP)
- Provider (State Management)

## Instalación

### Prerrequisitos
- .NET 9.0 SDK
- Node.js 18+ y npm
- Flutter SDK 3.0+
- PostgreSQL

### Backend (Domain + Api)

```bash
cd Domain
dotnet restore
cd ../Api
dotnet restore
dotnet run
```

### Web

```bash
cd Web
npm install
npm run dev
```

### App

```bash
cd App
flutter pub get
flutter run
```

## Configuración

### Base de Datos
Actualiza la cadena de conexión en `Api/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=ecomers_db;Username=usuario;Password=contraseña"
}
```

### API URL
- **Web**: Edita `Web/.env` y actualiza `VITE_API_URL`
- **App**: Edita `App/lib/services/api_service.dart` y actualiza `baseUrl`

## Puertos por Defecto
- API: https://localhost:5001
- Web: http://localhost:3000
- App: Emulador/Dispositivo

## Desarrollo

### Ejecutar la API
```bash
cd Api
dotnet watch run
```

### Ejecutar el Web
```bash
cd Web
npm run dev
```

### Ejecutar la App
```bash
cd App
flutter run
```
