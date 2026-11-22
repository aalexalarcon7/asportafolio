# AS Design Studio — Motion & Gallery V1.3

Esta versión toma la web V1.2 como base y conserva el loader V2.1, el Hero, la Exhibition, el desplazamiento horizontal de Selected Works y la cinta infinita de Toolbox.

## Cambios

- **Visor editorial mejorado**: entrada cinematográfica y salida suave, cambio de imágenes con desenfoque de transición, barra de progreso y miniaturas seleccionables.
- **Navegación completa**: botones, flechas del teclado, gesto horizontal táctil (en la imagen), cierre con Escape y retorno del foco al elemento original.
- **Zoom y arrastre**: doble clic para ampliar, botón de zoom, desplazamiento de la pieza ampliada, reinicio del zoom al pasar a otra imagen.
- **Obras completas**: las imágenes se muestran con `object-fit: contain`, sin deformación ni recorte de láminas verticales o composiciones editoriales.
- **A Closer Look**: las piezas se revelan con una máscara editorial sutil, iluminación localizada según la posición del cursor y un hover limpio.
- **Rutas /works/[slug]**: animaciones de aparición al desplazarse por la página, sin alterar la navegación ni requerir dependencias nuevas.
- **Accesibilidad**: modal con foco controlado, alternativas para teclado/táctil y soporte de movimiento reducido.

## Archivos nuevos y modificados

- `src/components/ArtworkLightbox.tsx` — visor renovado.
- `src/components/ProjectRouteMotion.tsx` — componente nuevo para el scroll de las páginas individuales.
- `src/app/works/[slug]/page.tsx` — conexión con el componente de movimiento.
- `src/lib/motion-runtime.js` — iluminación interactiva en A Closer Look.
- `src/app/globals.css` — transiciones, composición y responsive.

## Instalar en el proyecto actual (PowerShell)

Se presupone que ya aplicaste la V1.2. **Antes de reemplazar archivos, asegurate de que tus cambios locales estén guardados en Git.**

```powershell
cd "C:\Users\alexa\OneDrive\Desktop\AS Portafolio\AS_Design_Studio_Web_1_0"
# Ejecutar con el servidor detenido (Ctrl+C)
Expand-Archive -Path "$env:USERPROFILE\Downloads\AS_Design_Studio_Actualizacion_1_3_Motion.zip" -DestinationPath . -Force
npm run build
npm run dev
```

Una vez comprobada la navegación en `localhost:3000`:

```powershell
git add .
git commit -m "feat: polish gallery motion and cinematic lightbox"
git push
```

El ZIP de actualización **no contiene imágenes ni dependencias**, por lo que no modifica las piezas originales de la diseñadora.

## Pruebas manuales recomendadas

1. Abrir Selected Works > Tango Arrabal > A Closer Look > cualquiera de sus láminas.
2. Probar miniaturas, flechas, Escape, zoom, arrastre y retorno al caso de estudio.
3. Repetir con Garamond (vertical) y Born To Die (horizontal).
4. Abrir directamente `/works/cachafaz`, desplazarse por la galería y ampliar una imagen.
5. Probar en móvil: desplazamiento táctil de imágenes y selección de miniaturas.
6. Confirmar que las animaciones del loader, Hero, Exhibition y Toolbox no cambiaron.

## Verificación

- Sintaxis de las piezas TypeScript/TSX modificadas verificada con el compilador TypeScript en modo transpile.
- `node --check` del módulo de movimiento: correcto.
- No fue posible completar `npm install` desde el entorno de generación por falta de paquetes en caché; `npm run build` debe ejecutarse en tu equipo antes del push.

> Los proyectos reales permanecen exactamente como se integraron en la V1.2. Esta actualización no agrega por ahora el quinto proyecto "Caminos Fáciles".
