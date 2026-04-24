# Script to load environment variables from .env before starting OpenCode
if (Test-Path .env) {
    Get-Content .env | Where-Object { $_ -match '^([^#=]+)=(.*)$' } | ForEach-Object {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Remove surrounding quotes if they exist
        $value = $value -replace '^["''](.*)["'']$', '$1'
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
    Write-Host "✅ Variables de .env cargadas en el entorno (incluyendo DAYTONA_API_KEY)" -ForegroundColor Green
} else {
    Write-Host "⚠️ No se encontró el archivo .env" -ForegroundColor Yellow
}

# Execute OpenCode passing any arguments
Write-Host "🚀 Iniciando OpenCode..." -ForegroundColor Cyan
opencode $args
