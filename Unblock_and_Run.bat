@echo off
title OpenCV Studio - Starting...
cd /d "%~dp0"

echo ================================================================
echo   OpenCV Studio - Automatic Unblocker & Launcher
echo ================================================================
echo.
echo [1/2] Unblocking downloaded files from Windows SmartScreen...
powershell -ExecutionPolicy Bypass -NoProfile -Command "Get-ChildItem -Path '%~dp0' -Recurse | Unblock-File" 2>nul

echo [2/2] Launching OpenCV Studio...
if exist "%~dp0OpenCV Studio.exe" (
    start "" "%~dp0OpenCV Studio.exe"
) else if exist "%~dp0OpenCV Studio-win32-x64\OpenCV Studio.exe" (
    start "" "%~dp0OpenCV Studio-win32-x64\OpenCV Studio.exe"
) else (
    echo [!] Could not locate OpenCV Studio.exe in this folder.
    echo Please make sure you extract the ZIP archive before running.
    pause
)
exit
