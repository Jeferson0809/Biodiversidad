# Sistema de Monitoreo de Biodiversidad — Páramo de Santurbán
**Proyecto:** CTeI-SGR-2024  
**Versión:** 2.0  
**Fecha:** Mayo 2026

**Autores:**
- Michael Alexander Aponte Rodriguez — 2222954
- Julian Javier Lizcano Villarreal — 2224647
- Jeferson Jair Acevedo Sarmiento — 2221790
- Camilo Iván Palacio Pérez — 2224643

---

## Descripción del proyecto

Aplicación web desarrollada como prototipo funcional de alta fidelidad para el monitoreo sistemático de la biodiversidad en el Páramo de Santurbán. El sistema permite a guardabosques y científicos documentar expediciones de campo, capturar registros biológicos con metadatos de geolocalización y altitud, y visualizar el estado del ecosistema mediante mapas de calor analíticos para entes territoriales.

El proyecto se enmarca en una inversión de 80–100 millones de COP financiados por el Fondo de Ciencia, Tecnología e Innovación del Sistema General de Regalías (SGR).

---

## Requerimientos funcionales implementados

| ID | Descripción | Estado |
|----|-------------|--------|
| RF1 | Gestión de expediciones y tracking GPS | ✅ Implementado |
| RF2 | Captura de registros biológicos con metadatos (coordenadas, altitud, fecha/hora) | ✅ Implementado |
| RF3 | Resiliencia en modo offline con cola de sincronización | ✅ Implementado |
| RF4 | Sincronización masiva con barra de progreso | ✅ Implementado |
| RF5 | Dashboard con mapas de calor geoespacial y filtros por tipo | ✅ Implementado |

## Requerimientos no funcionales implementados

| ID | Descripción | Estado |
|----|-------------|--------|
| RNF1 | Eficiencia energética (interfaz liviana, sin animaciones pesadas) | ✅ Implementado |
| RNF2 | Usabilidad para climas extremos (botones grandes, alto contraste) | ✅ Implementado |
| RNF3 | Seguridad y privacidad (badges de estado de sincronización) | ⚠️ Prototipo |

---

## Stack tecnológico

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** CSS Variables (sistema de diseño adaptable a modo oscuro/claro)
- **Visualización:** SVG nativo para mapa de calor geoespacial
- **Estado:** React Hooks (useState) — arquitectura sin dependencias externas
- **Arquitectura referencia:** Clean Architecture (capas de datos, dominio y presentación)

En producción el stack completo sería:
- **Móvil:** Kotlin nativo Android
- **Base de datos local:** SQLite / Room
- **Almacenamiento multimedia:** AWS S3
- **Base de datos geográfica:** PostgreSQL + PostGIS
- **Autenticación:** Biométrica + PIN AES-256

---

## Instalación y ejecución

### Prerrequisitos
- Node.js 18 o superior
- npm 9 o superior

### Pasos

```bash
# 1. Clonar o descomprimir el proyecto
cd santurban-monitor

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

### Build para producción

```bash
npm run build
npm run preview
```

### Sin instalación (recomendado para presentación)

1. Ir a [stackblitz.com](https://stackblitz.com)
2. New project → React
3. Reemplazar `src/App.tsx` con el código fuente
4. La app corre automáticamente en el navegador

---

## Estructura del proyecto

```
src/
├── App.tsx          # Componente principal — toda la lógica y UI
├── main.tsx         # Punto de entrada React
├── index.css        # Estilos globales
public/
├── favicon.svg
README.md
package.json
```

---

## Funcionalidades principales

### Dashboard
- Tarjetas de métricas en tiempo real: registros totales, especies avistadas, focos de degradación, expediciones activas
- Mapa de calor geoespacial del sector Santurbán con marcadores por tipo de hallazgo
- Gráfico de distribución por tipo de degradación ambiental (minería ilegal, pastoreo, quema, tala, contaminación)

### Módulo de registros biológicos
- Formulario de captura con: tipo de registro, especie o degradación, coordenadas GPS (lat/lng), altitud barométrica, notas de campo, expedición asociada
- Simulación de modo offline: el registro se guarda en cola local cuando no hay conectividad
- Sincronización inteligente con barra de progreso y estados: Sincronizado / Pendiente / En cola
- Filtrado por tipo: todos / especies / focos de degradación

### Módulo de expediciones
- Creación de sesiones de patrullaje con guardabosque responsable y ruta
- Seguimiento de estado: En progreso / Completada
- Visualización de km recorridos y registros por expedición

### Catálogo de especies
- 6 especies endémicas del páramo con nombre común, científico y estado de conservación IUCN
- Contador de avistamientos por especie actualizado en tiempo real

---

## Descripción de la actividad

### Resultado del desarrollo

Se desarrolló un prototipo funcional de alta fidelidad de la aplicación de monitoreo de biodiversidad para el Páramo de Santurbán. El prototipo implementa los cinco requerimientos funcionales y los tres no funcionales definidos en el documento técnico CTeI-SGR-2024. La interfaz fue construida con React y TypeScript sobre Vite, siguiendo principios de Clean Architecture con separación de responsabilidades entre la capa de datos (estado React), la capa de dominio (lógica de negocio en funciones puras) y la capa de presentación (componentes de UI).

El sistema demuestra el flujo completo: un guardabosque inicia una expedición, captura registros biológicos con metadatos geoespaciales, los almacena en modo offline cuando no hay conectividad, y los sincroniza al recuperar señal. El ente territorial puede visualizar el estado del ecosistema en el dashboard con mapa de calor y filtros analíticos.

### Evaluación funcional

| Funcionalidad | Resultado |
|---|---|
| Creación de expediciones | Funciona correctamente. Se generan IDs únicos y se almacenan en estado local |
| Captura de registros | Funciona correctamente. Admite coordenadas, altitud, tipo y notas de campo |
| Cola offline | Funciona correctamente. Los registros marcados como offline entran en estado "En cola" |
| Sincronización | Funciona correctamente. Simula carga asíncrona con progreso visual |
| Mapa de calor | Funciona correctamente. Calcula densidad por proximidad geoespacial sobre grilla SVG |
| Filtros de dashboard | Funciona correctamente. Filtrado por tipo de registro en tiempo real |
| Catálogo de especies | Funciona correctamente. Actualización reactiva de contadores de avistamiento |

### Evaluación de restricciones

| Restricción | Evaluación |
|---|---|
| **RNF1 — Eficiencia energética** | La aplicación no usa librerías pesadas ni animaciones de alto costo de CPU. El bundle es mínimo (React + Vite). En producción móvil se implementaría Dark Mode obligatorio y gestión pasiva de GPS. |
| **RNF2 — Usabilidad extrema** | Todos los elementos interactivos tienen área táctil ≥ 48px. El contraste de texto cumple WCAG AA. La navegación es simple y no requiere más de 2 toques para cualquier acción. |
| **RNF3 — Seguridad** | El prototipo no implementa cifrado real (limitación del entorno web). En la versión móvil nativa en Kotlin se implementaría AES-256 en reposo con SQLCipher y autenticación biométrica mediante BiometricPrompt API. |
| **Offline-First** | Simulado correctamente en el prototipo. En producción se usaría Room Database con WorkManager para la cola de sincronización. |
| **Metadatos EXIF** | Representados en el formulario. En producción se capturarían automáticamente desde la cámara nativa de Android con CameraX API. |

### Conclusiones

El prototipo demuestra la viabilidad técnica del sistema de monitoreo de biodiversidad para el Páramo de Santurbán. La arquitectura Offline-First propuesta es adecuada para las condiciones extremas del terreno, donde la conectividad es nula durante la mayor parte de las expediciones. El uso de React con TypeScript permitió iterar rápidamente sobre los requerimientos del cliente, validando la experiencia de usuario antes de comprometer recursos en el desarrollo nativo en Kotlin.

La decisión de migrar a Kotlin para la versión de producción está justificada por la necesidad de acceder a sensores nativos (barómetro, GPS de doble banda, cámara con metadatos EXIF), implementar cifrado AES-256 a nivel de sistema operativo y garantizar 12 horas de operación continua mediante gestión eficiente de batería — capacidades que no son alcanzables desde un entorno web móvil.

El modelo de datos implementado (Guardabosques → Expedición → RegistroBiológico → EspecieNativa / FocoDegradación) sigue fielmente el diagrama de clases UML del documento técnico y es directamente transferible a la implementación en Room Database / PostgreSQL+PostGIS.

### Recomendaciones (trabajo futuro)

1. **Implementación nativa Android en Kotlin** con CameraX, Room, WorkManager y BiometricPrompt según el stack definido en el informe técnico.
2. **Integración de Leaflet.js o Mapbox** para reemplazar el mapa de calor SVG por cartografía real del Páramo de Santurbán con capas GIS.
3. **Backend en AWS** con API REST documentada en Swagger, almacenamiento multimedia en S3 y base de datos geográfica en PostgreSQL+PostGIS.
4. **Implementación de cifrado AES-256** con SQLCipher para la base de datos local y TLS 1.3 para todas las comunicaciones en tránsito.
5. **Pruebas de campo (Visita 3 del plan de adquisiciones)** para calibración de sensores barométricos a la altitud real de Santurbán (3.000–4.200 m asl).
6. **Integración con el sistema de alertas de Corporaciones Autónomas Regionales** (CDMB y Corponor) para automatizar el reporte de focos de degradación crítica.
7. **Registro de propiedad intelectual** ante la DNDA a nombre de la Entidad Territorial, garantizando que el software sea Bien Público escalable a otros páramos de Colombia sin costos de licenciamiento.

---

## Metodología de desarrollo

El proyecto siguió la metodología **Scrum** con sprints quincenales:

- **Product Owner:** Representante del Ente Territorial
- **Scrum Master:** Líder técnico
- **Development Team:** Desarrolladores React/Kotlin, expertos GIS, diseñadores UI/UX
- **Stakeholders:** Guardabosques y científicos del páramo

Historia de usuario implementada en este sprint:
> *"Como Guardabosques en zona remota, quiero capturar la ubicación de un frailejón afectado por plaga de forma offline, para que la información se sincronice automáticamente cuando regrese a la estación y el ente territorial pueda actuar."*

---

## Propiedad intelectual

Este software es desarrollado con recursos del Sistema General de Regalías (SGR) y debe registrarse como **Bien Público** ante la DNDA a nombre de la Entidad Territorial o Universidad ejecutora. Esto garantiza su escalabilidad a otros páramos de Colombia sin costos de licenciamiento, maximizando el retorno social de la inversión estatal.

---

## Licencia

Dominio público — Bien Público financiado con recursos SGR. Libre uso, modificación y distribución por entidades del Estado colombiano.
