@echo off
REM ===============================================================
REM SKILL GAP ANALYZER - RUN SCRIPT (WINDOWS)
REM ===============================================================

if not exist "bin\com\skillgap\server\EmbeddedServer.class" (
    echo [*] Project is not compiled yet. Running build.bat first...
    call build.bat
    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%
)

set PORT=%1
if "%PORT%"=="" set PORT=8080

echo.
echo [*] Starting Skill Gap Analyzer Application Server...
echo [*] Launching on port %PORT%...
echo.

java -cp "bin;lib/*;config" com.skillgap.server.EmbeddedServer %PORT%

pause
