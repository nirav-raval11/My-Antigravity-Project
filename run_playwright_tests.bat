@echo off
cd /d "%~dp0"
echo =========================================================================
echo       SURYA CONSTRUCTION - PLAYWRIGHT E2E AUTOMATION TEST SUITE
echo =========================================================================
echo.
echo Choose execution mode:
echo [1] Headed Mode (Watch the browser type and click live on your screen!)
echo [2] Fast Headless Mode (Background execution)
echo.
set /p MODE="Select mode (1 or 2, default is 1): "

if "%MODE%"=="2" (
    echo.
    echo Running Playwright in Headless Mode...
    python test_playwright_e2e.py
) else (
    echo.
    echo Running Playwright in Visible Headed Mode (Live Browser Demo)...
    python test_playwright_e2e.py --headed
)

echo.
echo Automated test screenshots saved to: %CD%\test-results
echo.
pause
