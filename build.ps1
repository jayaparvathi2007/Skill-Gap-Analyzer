# ===============================================================
# SKILL GAP ANALYZER - POWERSHELL BUILD SCRIPT
# ===============================================================

Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "           BUILDING SKILL GAP ANALYZER PROJECT" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

Write-Host "[*] Compiling Java source files..." -ForegroundColor Yellow
$javaFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.java" | ForEach-Object { $_.FullName }
& javac -encoding UTF-8 -cp "lib/*" -d bin $javaFiles

if ($LASTEXITCODE -ne 0) {
    Write-Host "[-] Compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "[+] Compilation completed successfully into 'bin/'!" -ForegroundColor Green

# Package WAR
Write-Host "[*] Generating skillgaper.war package for Tomcat deployment..." -ForegroundColor Yellow
if (Test-Path "build") { Remove-Item "build" -Recurse -Force }
New-Item -ItemType Directory -Path "build\war\WEB-INF\classes" -Force | Out-Null
New-Item -ItemType Directory -Path "build\war\WEB-INF\lib" -Force | Out-Null

Copy-Item -Path "webapp\*" -Destination "build\war" -Recurse -Force
Copy-Item -Path "bin\*" -Destination "build\war\WEB-INF\classes" -Recurse -Force
Copy-Item -Path "lib\*" -Destination "build\war\WEB-INF\lib" -Recurse -Force
if (Test-Path "config\db.properties") {
    Copy-Item -Path "config\db.properties" -Destination "build\war\WEB-INF\classes" -Force
}

Set-Location "build\war"
& jar -cf "..\..\skillgaper.war" *
Set-Location "..\..\"
Remove-Item "build" -Recurse -Force

Write-Host "[+] Created 'skillgaper.war' successfully!" -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "[*] You can now run the application with: .\run.ps1 or run.bat" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan
