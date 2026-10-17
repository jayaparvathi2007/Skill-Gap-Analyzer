@echo off
REM ===============================================================
REM SKILL GAP ANALYZER - DATABASE SETUP SCRIPT
REM ===============================================================

echo ===============================================================
echo        SKILL GAP ANALYZER - DATABASE INITIALIZATION
echo ===============================================================

set DB_PASS=%1

if "%DB_PASS%"=="" (
    set /p DB_PASS="Enter your MySQL root password (press Enter if none or default): "
)

echo [*] Initializing MySQL Database 'skill_gap_db'...

if "%DB_PASS%"=="" (
    mysql -u root < database\skill_gap_db.sql
) else (
    mysql -u root -p%DB_PASS% < database\skill_gap_db.sql
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [-] Failed to import database schema!
    echo [-] Please check your MySQL root password and ensure MySQL service is running.
    echo [-] You can also manually import the script: database\skill_gap_db.sql in MySQL Workbench.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [+] Database and seed tables created successfully!

REM Update config/db.properties with the provided password
(
echo # ===============================================================
echo # Skill Gap Analyzer - MySQL Database Configuration
echo # ===============================================================
echo db.driver=com.mysql.cj.jdbc.Driver
echo db.url=jdbc:mysql://localhost:3306/skill_gap_db?useSSL=false^&allowPublicKeyRetrieval=true^&serverTimezone=UTC^&characterEncoding=UTF-8
echo db.username=root
echo db.password=%DB_PASS%
echo db.initialPoolSize=5
echo db.maxPoolSize=20
) > config\db.properties

echo [+] Updated config/db.properties with your MySQL credentials.
echo.
echo [*] You can now compile and run the application using: run.bat
echo ===============================================================
pause
