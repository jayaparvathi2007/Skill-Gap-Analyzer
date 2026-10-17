# ===============================================================
# SKILL GAP ANALYZER - POWERSHELL DATABASE SETUP SCRIPT
# ===============================================================

param(
    [string]$Password = ""
)

Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "       SKILL GAP ANALYZER - DATABASE INITIALIZATION" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

if (-not $Password) {
    $Password = Read-Host "Enter your MySQL root password (press Enter for Harshi@09 or empty)"
    if (-not $Password) {
        $Password = "Harshi@09"
    }
}

Write-Host "[*] Importing database schema and seed data into MySQL..." -ForegroundColor Yellow

$sqlContent = Get-Content -Path "database\skill_gap_db.sql" -Raw

$mysqlCmd = Get-Command "mysql" -ErrorAction SilentlyContinue
if (-not $mysqlCmd) {
    if (Test-Path "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe") {
        $mysqlExe = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    } else {
        Write-Host "[-] MySQL client not found in PATH or standard location." -ForegroundColor Red
        exit 1
    }
} else {
    $mysqlExe = "mysql"
}

$sqlContent | & $mysqlExe -u root "-p$Password"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[-] Failed to import database schema. Please check your credentials." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "[+] Database 'skill_gap_db' initialized successfully!" -ForegroundColor Green

# Update config/db.properties
$propsContent = @"
# ===============================================================
# Skill Gap Analyzer - MySQL Database Configuration
# ===============================================================
db.driver=com.mysql.cj.jdbc.Driver
db.url=jdbc:mysql://localhost:3306/skill_gap_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
db.username=root
db.password=$Password
db.initialPoolSize=5
db.maxPoolSize=20
"@

Set-Content -Path "config\db.properties" -Value $propsContent -Encoding Ascii
Write-Host "[+] Updated config\db.properties with your MySQL credentials." -ForegroundColor Green
Write-Host "[*] You can now start the application with: .\run.ps1 or run.bat" -ForegroundColor Cyan
