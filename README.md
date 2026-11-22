# AS Design Studio — Web 1.0

Portafolio real en **Next.js 16 + React 19 + TypeScript + Tailwind CSS 4**, migrado desde el prototipo aprobado **Motion V2.4**.

## Arranque local

Requiere Node.js 20.9+ (recomendado 22 LTS):

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. En Windows también podés ejecutar `INICIAR-WINDOWS.ps1` desde PowerShell.

Para una vista inmediata sin npm, abrir `preview-standalone.html`.

Producción:

```bash
npm run build
npm start
```

## Qué se conservó

- Preloader V2.1: estrella fugaz, iluminación, profundidad, tarjeta y transición.
- Hero tipográfico y transición con scroll a Exhibition.
- Exhibition inmersiva con capas y perspectiva.
- Selected Works V2.3 con recorrido horizontal, drag, cursor y apertura FLIP.
- V2.4: casos de estudio con capítulos, progreso de lectura, siguiente/anterior.
- Toolbox V2.2: cinta infinita hacia la derecha (pausa en hover).
- About, Contact y adaptación responsive/reduced motion.

## Dónde editar

- **`src/data/site.ts`**: proyectos, categorías, descripciones, herramientas y correo real.
- **`src/components/sections/`**: secciones, títulos y contenido editorial.
- **`src/app/globals.css`**: diseño, responsive y motion CSS.
- **`src/lib/motion-runtime.js`**: animaciones originales aprobadas de la V2.4, en un módulo independiente inicializado por `MotionController`.
- **`src/app/works/[slug]/page.tsx`**: rutas individuales de proyectos (adicionales al visor cinematográfico de la home).
- **`public/brand/logo-original-referencia.png`**: logo provisto; conservar. Para una fidelidad máxima al loader conviene solicitarlo en SVG con capas.

Los proyectos y piezas gráficas actuales son **materiales de demostración**, no trabajos de la diseñadora. El correo y enlaces de contacto no fueron proporcionados; el CTA no envía mensajes hasta configurarlo. No se ha conectado dominio, hosting ni backend.

## Antes de publicar

1. Sustituir contenidos ilustrativos por proyectos y fotos autorizados de la diseñadora.
2. Configurar `studio.contactEmail`, y enlaces reales de redes.
3. Confirmar escritura oficial de **design studio** y obtener logo vectorial.
4. Revisar copys, SEO, accesibilidad y uso de imágenes/licencias.
5. Cambiar `studio.isPrelaunch` a `false` para habilitar indexación en buscadores.
6. Ejecutar pruebas y construir con `npm run build` en entorno con acceso a npm.

## Nota de compatibilidad

Se conservaron los efectos desarrollados en JavaScript DOM para no reescribir toda la coreografía durante esta migración. La estructura de componentes React ya está separada. El próximo refactor recomendado es convertir la lógica de animación en hooks por sección y desacoplar la vista del proyecto, **sin cambiar lo aprobado**.

## Validación en este entorno

Se verificó el HTML original de V2.4 con Playwright. No fue posible instalar dependencias npm por conectividad de DNS; por lo tanto **no se ha ejecutado aquí un `next build` completo**. Se incluye además la vista previa HTML independiente para revisar la experiencia.
