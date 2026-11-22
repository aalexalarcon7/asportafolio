# Ejecutar desde PowerShell, en la carpeta del proyecto.
$ErrorActionPreference = "Stop"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Instalá Node.js 22 LTS desde https://nodejs.org" }
if (-not (Test-Path "node_modules")) {
  Write-Host "Instalando dependencias de AS Design Studio..."
  npm install
  if ($LASTEXITCODE -ne 0) { throw "No se pudieron instalar las dependencias. Revisá tu conexión." }
}
Write-Host "Abrí http://localhost:3000 en tu navegador" -ForegroundColor Cyan
npm run dev
