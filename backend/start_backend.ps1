# Start the Achievement Web Backend Server
# This script ensures the backend runs from the correct directory

Write-Host "Starting Achievement Web Backend..." -ForegroundColor Green
Write-Host "Working Directory: $PSScriptRoot" -ForegroundColor Cyan

# Activate virtual environment if it exists
$venvPath = Join-Path $PSScriptRoot "..\\.venv\\Scripts\\Activate.ps1"
if (Test-Path $venvPath) {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & $venvPath
}

# Run uvicorn from the backend directory
python -m uvicorn app.main:app --reload --port 8000
