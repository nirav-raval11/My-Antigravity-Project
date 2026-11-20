@echo off
cd /d "%~dp0"
echo ========================================================
echo Starting Surya Construction Local Server...
echo Folder: %CD%
echo URL: http://localhost:8000
echo ========================================================
start "" "http://localhost:8000"
python -m http.server 8000 --directory "%~dp0"
