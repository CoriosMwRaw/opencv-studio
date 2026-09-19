@echo off
chcp 65001 > nul
title OpenCV Studio

cd /d "%~dp0"

:: 1. Ejecutar el ejecutable compilado nativo (Sin necesidad de consola ni Node)
if exist "dist\OpenCV Studio-win32-x64\OpenCV Studio.exe" (
    start "" "%~dp0dist\OpenCV Studio-win32-x64\OpenCV Studio.exe"
    exit
)

:: 2. Si esta en modo desarrollo con Electron instalado
if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" .
    exit
)

:: 3. Alternativa web ligera en navegador
start "" "index.html"
exit
