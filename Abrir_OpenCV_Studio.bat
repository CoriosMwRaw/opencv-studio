@echo off
title OpenCV Studio - Iniciando...
cd /d "%~dp0"

echo ================================================================
echo   OpenCV Studio - Iniciador y Desbloqueador Automatico
echo ================================================================
echo.
echo [1/2] Desbloqueando archivos protegidos por Windows SmartScreen...
powershell -ExecutionPolicy Bypass -NoProfile -Command "Get-ChildItem -Path '%~dp0' -Recurse | Unblock-File" 2>nul

echo [2/2] Iniciando OpenCV Studio...
if exist "%~dp0OpenCV Studio.exe" (
    start "" "%~dp0OpenCV Studio.exe"
) else if exist "%~dp0OpenCV Studio-win32-x64\OpenCV Studio.exe" (
    start "" "%~dp0OpenCV Studio-win32-x64\OpenCV Studio.exe"
) else (
    echo [!] No se encontro OpenCV Studio.exe en esta carpeta.
    echo Asegurate de extraer completamente el archivo ZIP antes de ejecutarlo.
    pause
)
exit
