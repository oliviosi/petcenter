param(
  [string]$Urls = "http://localhost:5000;https://localhost:5001"
)

Write-Host "Stopping processes listening on ports 5000/5001 (if any)" -ForegroundColor Yellow
$pids = @(Get-NetTCPConnection -LocalPort 5000,5001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique)
if ($pids.Count -gt 0) {
  foreach ($pid in $pids) {
    try {
      $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
      if ($proc) {
        Write-Host "Stopping PID $pid ($($proc.ProcessName))" -ForegroundColor Yellow
        Stop-Process -Id $pid -Force
      }
    } catch {
      Write-Host "Failed to stop PID $pid: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
} else {
  Write-Host "No processes found on ports 5000/5001" -ForegroundColor Green
}

Write-Host "Starting API with URLs: $Urls" -ForegroundColor Cyan
# Run dotnet in the current console so user sees logs and it blocks this session
dotnet run --project "${PSScriptRoot}\..\Api.csproj" --urls $Urls
