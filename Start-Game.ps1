param([int]$Port = 8080)
$ErrorActionPreference = 'Stop'
$pythonCandidates = @('C:\Python314\python.exe', 'C:\Python313\python.exe', 'C:\Python312\python.exe')
$command = Get-Command python -ErrorAction SilentlyContinue
if ($command -and $command.Source -notlike '*\WindowsApps\*') { $pythonCandidates += $command.Source }
$pythonExecutable = $pythonCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $pythonExecutable) { throw 'Python 3 is required. Install Python or serve this folder with your preferred static web server.' }
Write-Output "Game: http://localhost:$Port/"
Write-Output "Sprite preview: http://localhost:$Port/sprite-preview.html"
Write-Output 'Press Ctrl+C to stop the server.'
& $pythonExecutable -m http.server $Port --bind 127.0.0.1 --directory $PSScriptRoot
