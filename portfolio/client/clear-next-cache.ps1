# PowerShell script to forcibly delete the .next directory to fix permission issues

$nextDir = Join-Path -Path (Get-Location) -ChildPath ".next"

if (Test-Path $nextDir) {
    Write-Host "Deleting .next directory..."
    try {
        Remove-Item -Path $nextDir -Recurse -Force -ErrorAction Stop
        Write-Host ".next directory deleted successfully."
    }
    catch {
        Write-Error "Failed to delete .next directory. Please close any running processes that might be locking files and try again."
    }
}
else {
    Write-Host ".next directory does not exist."
}
