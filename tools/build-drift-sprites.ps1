param([string]$InputDirectory = '.source-animations/drift')
$ErrorActionPreference = 'Stop'
$workspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$inputRoot = Join-Path $workspace $InputDirectory
$destination = Join-Path $workspace 'sprites/drift'
$ffmpeg = 'C:\ffmpeg\bin\ffmpeg.exe'
New-Item -ItemType Directory -Force $destination | Out-Null
foreach ($name in @('movement','attacks','kicks-falls','reactions')) {
  $source = Join-Path $inputRoot ($name + '-key.png')
  $output = Join-Path $destination ($name + '.png')
  # Generated artwork is keyed with the same FFmpeg alpha workflow used by the
  # original recorded fighter. The deployed PNGs have real RGBA transparency.
  & $ffmpeg -hide_banner -loglevel error -y -i $source -vf "format=rgba,colorkey=0x00FF00:0.16:0.12,geq=r='r(X,Y)':g='if(lt(alpha(X,Y),250),min(g(X,Y),max(r(X,Y),b(X,Y))),g(X,Y))':b='b(X,Y)':a='alpha(X,Y)',format=rgba" -frames:v 1 -update 1 $output
  if ($LASTEXITCODE -ne 0) { throw "Sprite alpha conversion failed: $name" }
}
& $ffmpeg -hide_banner -loglevel error -y -i (Join-Path $destination 'movement.png') -i (Join-Path $destination 'attacks.png') -i (Join-Path $destination 'kicks-falls.png') -i (Join-Path $destination 'reactions.png') -filter_complex 'vstack=inputs=4,format=rgba' -frames:v 1 -update 1 (Join-Path $destination 'drift-complete.png')
if ($LASTEXITCODE -ne 0) { throw 'Combined atlas failed.' }
Write-Output 'Built four RGBA atlas pages and the complete 96-pose sprite sheet.'
