# TREINTA Asistencia Móvil

Aplicación independiente para el proyecto de asistencia móvil de TREINTA S.A.C.

> Estado: prototipo de desarrollo. No usar para control laboral real hasta completar autenticación, integración ERP, almacenamiento privado y pruebas piloto.

## Desarrollo

- React 18 + TypeScript + Vite
- Preparación de dependencias Capacitor para Android/iOS
- Interfaz de demostración con datos ficticios

## Límites actuales

- No conectado al ERP ni a AppSheet.
- No captura ni transmite fotos o GPS.
- Las marcaciones son simuladas.
- No contiene credenciales ni secretos.

El ERP TREINTA continúa siendo el sistema maestro. AppSheet debe mantenerse como fuente oficial hasta validar la nueva app en paralelo.

## Seguridad y privacidad

Antes de producción: autenticación real del lado servidor, permisos por rol y tienda, endpoints verificados, fotos en almacenamiento privado, consentimiento informado, auditoría, política de retención y cumplimiento de la Ley 29733 del Perú.

## Compilar

```bash
npm install
npm run build
```

La integración productiva y el empaquetado nativo se realizarán en etapas separadas, sin modificar el repositorio ni los servicios del ERP.
