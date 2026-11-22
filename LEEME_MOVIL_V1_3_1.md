# AS Design Studio — Hotfix móvil V1.3.1

Corrige el cuello de botella potencial al desplazarse del Hero a la Exhibition en celulares.

## Archivos actualizados

- `src/lib/motion-runtime.js`: evita animaciones fuera de pantalla, hace una sola lectura del layout por sección y usa movimientos 2D más ligeros en móvil. **El efecto 3D aprobado en escritorio se conserva.**
- `src/app/globals.css`: reduce sombras y profundidad en la Exhibition móvil manteniendo la estética oscura.

No se modifican el loader, el contenido de los proyectos, el visor, las imágenes, el Hero de escritorio ni las herramientas.

## Aplicación (PowerShell en Windows)

1. Descargar `AS_Design_Studio_Hotfix_Movil_V1_3_1.zip` a Descargas.
2. Detener `npm run dev` con `Ctrl+C`.
3. Ejecutar desde la raíz del proyecto:

```powershell
cd "C:\Users\alexa\OneDrive\Desktop\AS Portafolio\AS_Design_Studio_Web_1_0"
Expand-Archive -Path "$env:USERPROFILE\Downloads\AS_Design_Studio_Hotfix_Movil_V1_3_1.zip" -DestinationPath . -Force
npm run build
npm run dev
```

4. Comprobar el recorrido Hero → Exhibition en un celular real. Si la compilación finaliza correctamente y se siente fluido:

```powershell
git add src/lib/motion-runtime.js src/app/globals.css
git commit -m "perf: smooth mobile hero-to-exhibition scroll"
git push origin main
```

Vercel generará un nuevo despliegue si se mantiene la integración automática.

## Validaciones realizadas

- Sintaxis JavaScript verificada con `node --check`.
- Se comparó la base local con los hashes de los archivos publicados en GitHub.
- No se pudo ejecutar una prueba gráfica en navegador debido a restricciones del entorno ni compilar Next.js sin `node_modules`; validar en localhost y celular antes del push.

## Reversión

Antes del push, `git restore src/lib/motion-runtime.js src/app/globals.css` devuelve los archivos al último commit. Después del push, revertí el commit con `git revert <SHA>` si fuera necesario.
