# ESETEL React App 

Panel de administración para el sistema de gestión de créditos de ESETEL construido con **React 19**, **Vite**, **Tailwind CSS** y una variedad de librerías especializadas para gráficos, formularios, calendarios y más.

## 🚀 Características principales

- Interfaz moderna y responsiva con Tailwind CSS.
- Manejo de formularios con `react-hook-form`.
- Peticiones HTTP con `axios` y manejo de datos con `react-query`.
- Soporte para drag and drop, subida de archivos y notificaciones.
- Enrutamiento con `react-router`.
- Arquitectura modular y optimizada para producción con Vite.

## 📦 Tecnologías y librerías usadas

### Dependencias principales

| Librería                        | Propósito                                      |
|--------------------------------|------------------------------------------------|
| `react` / `react-dom`          | Librería principal para UI                     |
| `react-router`                 | Enrutamiento SPA                               |
| `axios`                        | Cliente HTTP                                   |
| `@tanstack/react-query`        | Manejo de peticiones y caché de datos          |
| `react-hook-form`             | Formularios con validación                     |
| `react-toastify`               | Notificaciones                                 |
| `flatpickr`                    | Selector de fechas                             |
| `@fullcalendar/*`             | Calendario interactivo                         |
| `apexcharts` / `react-apexcharts` | Gráficos y visualización de datos         |
| `@react-jvectormap/*`         | Mapas interactivos                             |
| `react-dnd` / `react-dnd-html5-backend` | Drag & drop                         |
| `react-dropzone`              | Subida de archivos                             |
| `react-helmet-async`          | Manipulación del head (SEO, meta tags, etc.)   |
| `swiper`                      | Carruseles y sliders                           |
| `clsx`                        | Utilidad para clases condicionales             |
| `tailwind-merge`              | Combinar clases Tailwind sin conflictos        |

### Herramientas de desarrollo

| Herramienta                    | Uso                                             |
|-------------------------------|--------------------------------------------------|
| `vite`                        | Bundler ultrarrápido                            |
| `typescript`                  | Tipado estático                                 |
| `eslint`                      | Linter de código                                |
| `tailwindcss`                 | Estilos utilitarios                             |
| `vite-plugin-svgr`           | Importar SVG como componentes React             |

## 📂 Estructura del proyecto (resumida)

```
src/
│
├── components/         # Componentes reutilizables
├── pages/              # Páginas del sistema
├── services/           # Peticiones HTTP (axios)
├── hooks/              # Hooks personalizados
├── assets/             # Imágenes, íconos, etc.
└── App.tsx             # Componente principal
```

## ⚙️ Scripts disponibles

| Comando           | Descripción                                     |
|------------------|-------------------------------------------------|
| `npm run dev`     | Levanta el servidor de desarrollo (Vite)       |
| `npm run build`   | Compila la app para producción                  |
| `npm run preview` | Previsualiza el build de producción             |
| `npm run lint`    | Ejecuta ESLint sobre el código                  |

## 🚀 Primeros pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/HenrryDG/Proyecto3_SalamandraLabs_Frontend.git
   cd Proyecto3_SalamandraLabs_Frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` basado en `.env.example` y configura tu API:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
Gráficos sugeridos:
Tabla: Clientes con más compras

Gráfico de barras: Nuevos clientes por mes
