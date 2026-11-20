@echo off
cd /d "%~dp0"
echo =========================================================================
echo       SURYA CONSTRUCTION - GITHUB PUSH & VERCEL PREPARATION
echo =========================================================================
echo.
echo Step 1: Git repository is already initialized and committed on [main]!
echo.
echo Please create a NEW repository on GitHub (https://github.com/new)
echo Repository name suggestion: surya-construction
echo (Do NOT initialize with README or .gitignore - keep it empty!)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/USERNAME/surya-construction.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Exiting.
    pause
    exit /b
)

echo.
echo Connecting to GitHub: %REPO_URL% ...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================================================
    echo [SUCCESS] Your code is live on GitHub!
    echo.
    echo Next Step - Deploy to Vercel:
    echo 1. Go to https://vercel.com and click 'Add New...' - 'Project'
    echo 2. Import your GitHub repository: surya-construction
    echo 3. Click 'Deploy' (Settings are pre-configured in vercel.json)
    echo =========================================================================
) else (
    echo.
    echo [NOTE] If prompted for GitHub login, please sign in via browser or Personal Access Token (PAT).
)

echo.
pause
