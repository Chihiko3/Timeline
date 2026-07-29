$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $root "timelines\SpikeChunsoftNarrative\timeline-images.js"
$outputDirectory = Join-Path $root "timelines\SpikeChunsoftNarrative\assets\covers"
$userAgent = "GameTimelineArchive/1.0 (personal research archive)"

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

# Prefer the original Japanese package for each release. The four Yahoo entries
# fill modern titles whose Japanese box art is missing from LaunchBox.
$artworkSources = @(
  @{ Id = "portopia-fc"; Name = "The Portopia Serial Murder Case (Famicom)"; File = "portopia-fc-01.jpg"; Url = "https://images.launchbox-app.com/626cd1d2-13f1-46c8-8b89-4da61d1fd284.jpg"; Label = "Japanese Famicom box front" },
  @{ Id = "otogiriso"; Name = "Otogirisou"; File = "otogiriso-01.png"; Url = "https://images.launchbox-app.com/1a83327b-1873-4ee8-8775-8e1e1827f325.png"; Label = "Japanese Super Famicom box front" },
  @{ Id = "kamaitachi"; Name = "Kamaitachi no Yoru"; File = "kamaitachi-01.jpg"; Url = "https://images.launchbox-app.com/r2_c9519cf1-a06a-417e-b992-84c096076690.jpg"; Label = "Japanese Super Famicom box front" },
  @{ Id = "machi"; Name = "Machi: Unmei no Kousaten"; File = "machi-01.jpg"; Url = "https://images.launchbox-app.com/0a1e6041-cd6d-456f-bdab-3fe19f139d24.jpg"; Label = "Japanese Sega Saturn box front" },
  @{ Id = "kamaitachi2"; Name = "Kamaitachi no Yoru 2"; File = "kamaitachi2-01.jpg"; Url = "https://images.launchbox-app.com/3d53de5b-c9f9-4c9f-8b85-399082919ec9.jpg"; Label = "Japanese PlayStation 2 box front" },
  @{ Id = "kinpachi"; Name = "3-Nen B-Gumi Kinpachi Sensei"; File = "kinpachi-01.jpg"; Url = "https://images.launchbox-app.com/11fefd8c-6fb5-4c34-9fa4-e28367e87cee.jpg"; Label = "Japanese PlayStation 2 box front" },
  @{ Id = "kamaitachi3"; Name = "Kamaitachi no Yoru x 3"; File = "kamaitachi3-01.jpg"; Url = "https://images.launchbox-app.com/a053d51d-d0ae-48ac-ab4d-f02b2af084cf.jpg"; Label = "Japanese PlayStation 2 box front" },
  @{ Id = "imabikisou"; Name = "Imabikisou"; File = "imabikisou-01.jpg"; Url = "https://images.launchbox-app.com/7d3c6201-99a3-4627-9419-31ecf6d604d9.jpg"; Label = "Japanese PlayStation 3 box front" },
  @{ Id = "428"; Name = "428: Shibuya Scramble"; File = "428-01.png"; Url = "https://images.launchbox-app.com/3eb5ba86-b049-4976-9500-45fc5e02eed0.png"; Label = "Japanese Wii box front" },
  @{ Id = "999"; Name = "Nine Hours, Nine Persons, Nine Doors"; File = "999-01.jpg"; Url = "https://images.launchbox-app.com/3354a07e-9a3f-40c7-8d9c-6155dcc1d01d.jpg"; Label = "Japanese Nintendo DS box front" },
  @{ Id = "trick-logic-1"; Name = "TRICK x LOGIC Season 1"; File = "trick-logic-1-01.jpg"; Url = "https://images.launchbox-app.com/15037339-6eef-4e5d-96d9-e02d92eaf5aa.jpg"; Label = "Japanese PSP box front" },
  @{ Id = "trick-logic-2"; Name = "TRICK x LOGIC Season 2"; File = "trick-logic-2-01.jpg"; Url = "https://images.launchbox-app.com/f7c8ee25-2f29-4354-a6ae-4f78526a0f87.jpg"; Label = "Japanese PSP box front" },
  @{ Id = "danganronpa"; Name = "Danganronpa: Trigger Happy Havoc"; File = "danganronpa-01.jpg"; Url = "https://images.launchbox-app.com/eda89f21-62a0-464c-b7bf-9c8546af7ab6.jpg"; Label = "Japanese PSP box front" },
  @{ Id = "shin-kamaitachi"; Name = "Shin Kamaitachi no Yoru"; File = "shin-kamaitachi-01.jpg"; Url = "https://images.launchbox-app.com/35aa8919-fd13-4577-9e35-6f6485a09829.jpg"; Label = "Japanese PlayStation Vita box front" },
  @{ Id = "vlr"; Name = "Zero Escape: Virtue's Last Reward"; File = "vlr-01.jpg"; Url = "https://images.launchbox-app.com/26144ca7-2fc0-44b8-ae40-f92700e8a535.jpg"; Label = "Japanese Nintendo 3DS box front" },
  @{ Id = "danganronpa2"; Name = "Danganronpa 2: Goodbye Despair"; File = "danganronpa2-01.jpg"; Url = "https://images.launchbox-app.com/db85d79b-891a-4ab5-961f-a1272e353bad.jpg"; Label = "Japanese PSP box front" },
  @{ Id = "ultra-despair-girls"; Name = "Danganronpa Another Episode: Ultra Despair Girls"; File = "ultra-despair-girls-01.jpg"; Url = "https://item-shopping.c.yimg.jp/i/f/globalmarche_4940261511555"; Label = "Japanese PlayStation Vita package" },
  @{ Id = "zero-time-dilemma"; Name = "Zero Escape: Zero Time Dilemma"; File = "zero-time-dilemma-01.jpg"; Url = "https://images.launchbox-app.com/3faa3970-d8c7-46bc-a913-347a6d7ce802.jpg"; Label = "Japanese Nintendo 3DS box front" },
  @{ Id = "danganronpa-v3"; Name = "Danganronpa V3: Killing Harmony"; File = "danganronpa-v3-01.jpg"; Url = "https://images.launchbox-app.com/3d4e0fd2-acc3-49d3-84a1-84ebd7f599d4.jpg"; Label = "Japanese PlayStation 4 box front" },
  @{ Id = "ai-somnium"; Name = "AI: The Somnium Files"; File = "ai-somnium-01.jpg"; Url = "https://item-shopping.c.yimg.jp/i/f/esdigital_10823569"; Label = "Japanese PlayStation 4 package" },
  @{ Id = "ai-nirvana"; Name = "AI: The Somnium Files - nirvanA Initiative"; File = "ai-nirvana-01.jpg"; Url = "https://images.launchbox-app.com/r2_31ea4829-1745-498c-9dac-108f3ceae5ce.jpg"; Label = "Japanese Nintendo Switch box front" },
  @{ Id = "rain-code"; Name = "Master Detective Archives: RAIN CODE"; File = "rain-code-01.jpg"; Url = "https://item-shopping.c.yimg.jp/i/f/1932_74672"; Label = "Japanese Nintendo Switch package" },
  @{ Id = "no-sleep-kaname"; Name = "No Sleep For Kaname Date"; File = "no-sleep-kaname-01.jpg"; Url = "https://item-shopping.c.yimg.jp/i/f/1932_79635"; Label = "Japanese Nintendo Switch package" },
  @{ Id = "shuten-order"; Name = "SHUTEN ORDER"; File = "shuten-order-01.jpg"; Url = "https://images.launchbox-app.com/25f9710d-9cae-4ba9-9cc3-f6edf583a03e.jpg"; Label = "Japanese Nintendo Switch box front" }
)

function Read-Manifest {
  $manifest = [ordered]@{}
  if (-not (Test-Path -LiteralPath $manifestPath)) {
    return $manifest
  }

  $source = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8
  $match = [regex]::Match($source, '=\s*(?<json>[\s\S]*);\s*$')
  if (-not $match.Success) {
    return $manifest
  }

  $parsed = $match.Groups["json"].Value | ConvertFrom-Json
  foreach ($property in $parsed.psobject.Properties) {
    $items = @($property.Value)
    foreach ($item in $items) {
      if ($item.src) {
        $item.src = $item.src -replace "^timelines/SpikeSeries/", "timelines/SpikeChunsoftNarrative/"
      }
    }
    $manifest[$property.Name] = $items
  }
  return $manifest
}

function Test-ImageSignature {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    return $false
  }
  $bytes = [IO.File]::ReadAllBytes($Path)
  if ($bytes.Length -lt 1024) {
    return $false
  }

  $isJpeg = $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8
  $isPng = $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and
    $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47
  $isWebp = $bytes.Length -ge 12 -and
    [Text.Encoding]::ASCII.GetString($bytes, 0, 4) -eq "RIFF" -and
    [Text.Encoding]::ASCII.GetString($bytes, 8, 4) -eq "WEBP"
  return $isJpeg -or $isPng -or $isWebp
}

$manifest = Read-Manifest
$client = New-Object System.Net.WebClient
$client.Headers["User-Agent"] = $userAgent

foreach ($artwork in $artworkSources) {
  $key = "spike-series:$($artwork.Id)"
  if ($manifest.Contains($key) -and @($manifest[$key]).Count -gt 0) {
    Write-Output "keep  $($artwork.Id)"
    continue
  }

  $target = Join-Path $outputDirectory $artwork.File
  try {
    $client.Headers["User-Agent"] = $userAgent
    $client.DownloadFile($artwork.Url, $target)
    if (-not (Test-ImageSignature -Path $target)) {
      Remove-Item -LiteralPath $target -Force
      throw "downloaded file is not a supported image"
    }

    $manifest[$key] = @(
      [ordered]@{
        id = "spike-$($artwork.Id)-01"
        name = "$($artwork.Name) - $($artwork.Label)"
        src = "timelines/SpikeChunsoftNarrative/assets/covers/$($artwork.File)"
      }
    )
    Write-Output "saved $($artwork.Id)"
  } catch {
    Write-Output "miss  $($artwork.Id) ($($_.Exception.Message))"
  }
  Start-Sleep -Milliseconds 120
}

$json = $manifest | ConvertTo-Json -Depth 8
$source = "window.SPIKE_SERIES_TIMELINE_IMAGES = $json;`n"
Set-Content -LiteralPath $manifestPath -Value $source -Encoding UTF8
Write-Output "Generated $manifestPath with $($manifest.Count) cards."
