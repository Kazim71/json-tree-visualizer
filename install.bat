@echo off
echo.
echo ========================================
echo   JSON Tree Visualizer - Setup
echo ========================================
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Installation failed!
    echo Please make sure Node.js and npm are installed.
    pause
    exit /b 1
)

echo.
echo ✅ Installation completed successfully!
echo.
echo Available commands:
echo   npm run dev     - Start development server
echo   npm run build   - Build for production
echo   npm run preview - Preview production build
echo.

set /p start="Would you like to start the development server now? (y/n): "
if /i "%start%"=="y" (
    echo.
    echo Starting development server...
    echo Open http://localhost:5173 in your browser
    echo.
    call npm run dev
) else (
    echo.
    echo You can start the development server later with: npm run dev
    echo.
)

pause