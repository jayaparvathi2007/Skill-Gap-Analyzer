param(
    [int]$Port = 8080
)

if (-not (Test-Path "bin\com\skillgap\server\EmbeddedServer.class")) {
    Write-Host "[*] Project not compiled yet. Running build.ps1 first..." -ForegroundColor Yellow
    & .\build.ps1
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ""
Write-Host "[*] Starting Skill Gap Analyzer Application Server..." -ForegroundColor Cyan
Write-Host "[*] Launching on port $Port..." -ForegroundColor Cyan
Write-Host ""

& java -cp "bin;lib/*;config" com.skillgap.server.EmbeddedServer $Port
