# Sync WordPress theme from XAMPP into this repo for GitHub.
$ErrorActionPreference = "Stop"

$src = "c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions"
$dst = Join-Path $PSScriptRoot "..\wordpress-theme\ai-coaching-solutions"

if (-not (Test-Path $src)) {
  Write-Error "Source theme not found: $src"
}

New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
robocopy $src $dst /E /XD .git node_modules /NFL /NDL /NJH /NJS | Out-Null
if ($LASTEXITCODE -ge 8) {
  Write-Error "robocopy failed with exit code $LASTEXITCODE"
}

Write-Host "Synced theme to $dst"
