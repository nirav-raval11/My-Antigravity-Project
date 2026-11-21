@echo off
cd /d "%~dp0"
echo =========================================================================
echo       SURYA CONSTRUCTION - GITHUB PUSH & VERCEL PREPARATION
echo =========================================================================
echo.
echo Current Remote Origin URL:
git remote -v
echo.
echo Please enter your ACTUAL GitHub Repository URL.
echo Example: https://github.com/kinal/My-Antigravity-Project.git
echo (Do not use the word USERNAME - use your real GitHub username!)
echo.
set /p REPO_URL="GitHub Repository URL: "

if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
    echo Updated origin to: %REPO_URL%
)

git branch -M main

echo.
echo Pushing code to GitHub...
echo (If a browser window opens, click 'Sign in with browser' to authenticate)
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================================================
    echo [SUCCESS] Your code is live on GitHub!
    echo.
    echo Next Step - Deploy to Vercel:
    echo 1. Go to https://vercel.com and click 'Add New...' -> 'Project'
    echo 2. Import your GitHub repository
    echo 3. Click 'Deploy'
    echo =========================================================================
) else (
    echo.
    echo [ERROR] Push failed. Please verify your repository URL and login credentials.
)

echo.
pause
