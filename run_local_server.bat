@echo off
cd /d "%~dp0"
echo ========================================================
echo   Starting Surya Construction Local Server...
echo   Folder: %CD%
echo   URL: http://localhost:8000
echo ========================================================
echo.
echo Launching browser in 2 seconds...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8000"
python -m http.server 8000
