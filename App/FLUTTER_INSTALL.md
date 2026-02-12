# Instrucciones de Instalación de Flutter

Flutter no está instalado en tu sistema o no está en el PATH.

## Instalar Flutter

### Windows

1. Descarga el Flutter SDK desde: https://flutter.dev/docs/get-started/install/windows
2. Extrae el archivo zip en una ubicación (ejemplo: `C:\src\flutter`)
3. Agrega Flutter al PATH:
   - Busca "Editar las variables de entorno del sistema"
   - Click en "Variables de entorno"
   - En "Variables del sistema", busca "Path" y edítala
   - Agrega una nueva entrada: `C:\src\flutter\bin`
4. Reinicia tu terminal
5. Verifica la instalación: `flutter doctor`

## Instalar Dependencias de la App

Una vez Flutter esté instalado, ejecuta en la carpeta App:

```bash
cd App
flutter pub get
```

## Verificar Flutter

```bash
flutter doctor
```

Este comando te mostrará qué componentes faltan (Android SDK, Xcode para iOS, etc.)

## Ejecutar la App

```bash
flutter run
```

O para web:

```bash
flutter run -d chrome
```
