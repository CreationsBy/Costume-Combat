param(
  [string]$InputDirectory = ".source-animations/deploy-clips",
  [string]$PackFile = "sprite-pack.bin",
  [string]$ManifestFile = "sprite-manifest.js",
  [int]$FrameRate = 15,
  [int]$FrameWidth = 288,
  [int]$FrameHeight = 344,
  [int]$MaximumFramesPerSheet = 32,
  [switch]$Force
)

$ErrorActionPreference = "Stop"
$workspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$inputRoot = [IO.Path]::GetFullPath((Join-Path $workspace $InputDirectory))
$packPath = [IO.Path]::GetFullPath((Join-Path $workspace $PackFile))
$manifestPath = [IO.Path]::GetFullPath((Join-Path $workspace $ManifestFile))
$buildRoot = [IO.Path]::GetFullPath((Join-Path $workspace ".sprites-build"))
$packBuildPath = [IO.Path]::GetFullPath((Join-Path $workspace ".sprite-pack.build"))
$manifestBuildPath = [IO.Path]::GetFullPath((Join-Path $workspace ".sprite-manifest.build.js"))
$legacySpriteRoot = [IO.Path]::GetFullPath((Join-Path $workspace "sprites"))
$ffmpeg = "C:\ffmpeg\bin\ffmpeg.exe"
$ffprobe = "C:\ffmpeg\bin\ffprobe.exe"

if (-not (Test-Path -LiteralPath $ffmpeg) -or -not (Test-Path -LiteralPath $ffprobe)) {
  throw "FFmpeg and FFprobe are required in C:\ffmpeg\bin."
}
if (-not (Test-Path -LiteralPath $inputRoot)) {
  throw "Input directory not found: $inputRoot"
}
if (-not $packPath.StartsWith($workspace + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
  throw "Sprite pack must stay inside the project workspace."
}
if ((Test-Path -LiteralPath $packPath) -and -not $Force) {
  throw "Sprite pack already exists. Re-run with -Force to rebuild it."
}
if (Test-Path -LiteralPath $buildRoot) {
  Remove-Item -LiteralPath $buildRoot -Recurse -Force
}
foreach ($temporaryFile in @($packBuildPath, $manifestBuildPath)) {
  if (Test-Path -LiteralPath $temporaryFile) { Remove-Item -LiteralPath $temporaryFile -Force }
}
New-Item -ItemType Directory -Path $buildRoot | Out-Null

$videos = @(Get-ChildItem -LiteralPath $inputRoot -Recurse -File -Filter "*.mp4" | Sort-Object FullName)
if ($videos.Count -eq 0) { throw "No MP4 source animations were found in $inputRoot" }

$animations = [ordered]@{}
$culture = [Globalization.CultureInfo]::InvariantCulture
$completed = 0

foreach ($video in $videos) {
  $relativeInput = $video.FullName.Substring($inputRoot.TrimEnd("\").Length + 1)
  $sourceKey = "animations/" + $relativeInput.Replace("\", "/")
  $relativeDirectory = [IO.Path]::GetDirectoryName($relativeInput)
  $destinationDirectory = if ([string]::IsNullOrEmpty($relativeDirectory)) {
    $buildRoot
  } else {
    Join-Path $buildRoot $relativeDirectory
  }
  New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null

  $durationText = & $ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 -- $video.FullName
  if ($LASTEXITCODE -ne 0) { throw "FFprobe failed for $($video.FullName)" }
  $duration = [double]::Parse($durationText.Trim(), $culture)
  $frameCount = [Math]::Max(1, [Math]::Ceiling($duration * $FrameRate))

  if ($frameCount -le $MaximumFramesPerSheet) {
    $columns = [Math]::Min(8, [Math]::Ceiling([Math]::Sqrt($frameCount)))
    $rows = [Math]::Ceiling($frameCount / $columns)
  } else {
    $columns = 8
    $rows = [Math]::Ceiling($MaximumFramesPerSheet / $columns)
  }
  $sheetCapacity = $columns * $rows
  $expectedSheets = [Math]::Ceiling($frameCount / $sheetCapacity)
  $baseName = [IO.Path]::GetFileNameWithoutExtension($video.Name)
  $outputPattern = Join-Path $destinationDirectory ($baseName + "_%02d.webp")
  $filter = "fps=$FrameRate,scale=${FrameWidth}:${FrameHeight}:flags=lanczos,format=rgba,colorkey=0x000000:0.063:0.118,tile=${columns}x${rows}"

  & $ffmpeg -hide_banner -loglevel error -y -i $video.FullName -an -vf $filter -fps_mode vfr -c:v libwebp -quality 80 -compression_level 3 $outputPattern
  if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed for $($video.FullName)" }

  $generatedSheets = @(Get-ChildItem -LiteralPath $destinationDirectory -File -Filter ($baseName + "_*.webp") | Sort-Object Name)
  if ($generatedSheets.Count -ne $expectedSheets) {
    throw "Expected $expectedSheets sprite sheets for $relativeInput, but FFmpeg created $($generatedSheets.Count)."
  }

  $sheetEntries = @()
  for ($sheetIndex = 0; $sheetIndex -lt $generatedSheets.Count; $sheetIndex += 1) {
    $startFrame = $sheetIndex * $sheetCapacity
    $sheetFrameCount = [Math]::Min($sheetCapacity, $frameCount - $startFrame)
    $sheetRelative = $generatedSheets[$sheetIndex].FullName.Substring($buildRoot.TrimEnd("\").Length + 1).Replace("\", "/")
    $sheetEntries += [ordered]@{
      src = "sprites/" + $sheetRelative
      startFrame = $startFrame
      frameCount = $sheetFrameCount
    }
  }

  $animations[$sourceKey] = [ordered]@{
    duration = [Math]::Round($duration, 6)
    frameCount = $frameCount
    frameWidth = $FrameWidth
    frameHeight = $FrameHeight
    columns = $columns
    rows = $rows
    sheetCapacity = $sheetCapacity
    sheets = $sheetEntries
  }

  $completed += 1
  Write-Host ("[{0}/{1}] {2} -> {3} frame(s), {4} sheet(s)" -f $completed, $videos.Count, $relativeInput, $frameCount, $generatedSheets.Count)
}

$packStream = [IO.File]::Open($packBuildPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
try {
  foreach ($animationEntry in $animations.GetEnumerator()) {
    $packedSheets = @()
    foreach ($sheet in $animationEntry.Value.sheets) {
      $relativeSheet = $sheet.src.Substring("sprites/".Length).Replace("/", "\")
      $sheetPath = Join-Path $buildRoot $relativeSheet
      $sheetBytes = [IO.File]::ReadAllBytes($sheetPath)
      $offset = $packStream.Position
      $packStream.Write($sheetBytes, 0, $sheetBytes.Length)
      $packedSheets += [ordered]@{
        name = $sheet.src
        offset = $offset
        length = $sheetBytes.Length
        startFrame = $sheet.startFrame
        frameCount = $sheet.frameCount
      }
    }
    $animationEntry.Value.sheets = $packedSheets
  }
} finally {
  $packStream.Dispose()
}

$packBytes = (Get-Item -LiteralPath $packBuildPath).Length
$manifest = [ordered]@{
  version = 2
  frameRate = $FrameRate
  generatedFrom = "Costume Combat source animations"
  pack = $PackFile.Replace("\", "/")
  packBytes = $packBytes
  animations = $animations
}
$json = $manifest | ConvertTo-Json -Depth 12 -Compress
[IO.File]::WriteAllText($manifestBuildPath, "const SPRITE_MANIFEST = $json;`nexport default SPRITE_MANIFEST;`n", [Text.UTF8Encoding]::new($false))

if (Test-Path -LiteralPath $packPath) { Remove-Item -LiteralPath $packPath -Force }
Move-Item -LiteralPath $packBuildPath -Destination $packPath
Move-Item -LiteralPath $manifestBuildPath -Destination $manifestPath -Force
if (Test-Path -LiteralPath $legacySpriteRoot) { Remove-Item -LiteralPath $legacySpriteRoot -Recurse -Force }
Remove-Item -LiteralPath $buildRoot -Recurse -Force

Write-Host ("Packed {0} animations and their {1} internal sheets into {2} ({3:N2} MB)." -f $animations.Count, ($animations.Values.sheets.Count | Measure-Object -Sum).Sum, $PackFile, ($packBytes / 1MB))
Write-Host "Manifest: $manifestPath"
