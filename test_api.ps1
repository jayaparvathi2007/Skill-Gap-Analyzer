$ErrorActionPreference = "Stop"

Write-Host "1. Testing Login as Alex Morgan..." -ForegroundColor Cyan
$loginBody = '{"email":"alex@example.com","password":"demo123"}'
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$loginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $session
Write-Host "Login Result:" -ForegroundColor Green
$loginResp | ConvertTo-Json -Depth 3

Write-Host "`n2. Testing /api/dashboard..." -ForegroundColor Cyan
$dashResp = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard" -Method Get -WebSession $session
Write-Host "Dashboard Match Score:" $dashResp.data.gapAnalysis.matchPercentage "%" -ForegroundColor Green
Write-Host "Readiness Level:" $dashResp.data.gapAnalysis.readinessLevel -ForegroundColor Green
Write-Host "Total User Skills:" $dashResp.data.totalUserSkills -ForegroundColor Green
Write-Host "Missing Skills Count:" $dashResp.data.gapAnalysis.missingSkillsCount -ForegroundColor Green

Write-Host "`n3. Testing /api/analyze for Role 1..." -ForegroundColor Cyan
$analyzeResp = Invoke-RestMethod -Uri "http://localhost:8080/api/analyze?roleId=1" -Method Get -WebSession $session
Write-Host "Role:" $analyzeResp.data.roleTitle -ForegroundColor Green
Write-Host "Direct Match:" $analyzeResp.data.matchPercentage "%" -ForegroundColor Green
Write-Host "Weighted Match:" $analyzeResp.data.weightedPercentage "%" -ForegroundColor Green
Write-Host "Matched Skills:" ($analyzeResp.data.matchedSkills | ForEach-Object { $_.skillName }) -join ", " -ForegroundColor Green
Write-Host "Missing Skills:" ($analyzeResp.data.missingSkills | ForEach-Object { $_.skillName }) -join ", " -ForegroundColor Yellow

Write-Host "`n4. Testing /api/skills/user..." -ForegroundColor Cyan
$skillsResp = Invoke-RestMethod -Uri "http://localhost:8080/api/skills/user" -Method Get -WebSession $session
Write-Host "User Skills Count:" $skillsResp.data.Count -ForegroundColor Green

Write-Host "`n5. Testing /api/roles..." -ForegroundColor Cyan
$rolesResp = Invoke-RestMethod -Uri "http://localhost:8080/api/roles" -Method Get
Write-Host "Total Available Roles in DB:" $rolesResp.data.Count -ForegroundColor Green

Write-Host "`nALL API TESTS PASSED SUCCESSFULLY!" -ForegroundColor Green
