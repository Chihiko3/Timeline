$ErrorActionPreference = 'Continue'

# Pull one vetted representative image for each currently-empty Final Fantasy
# timeline card. The image becomes a managed asset immediately, so the GM panel
# remains the single source of truth for ordering and future replacement.
$root = Split-Path -Parent $PSScriptRoot
$dataPath = Join-Path $root 'timelines\final-fantasy\final-fantasy-releases.js'
$manifestPath = Join-Path $root 'timelines\final-fantasy\timeline-images.js'
$assetRoot = Join-Path $root 'timelines\final-fantasy\assets\covers'
$headers = @{ 'User-Agent' = 'GameArchiveLocal/1.0 (personal archival project)' }
$api = 'https://finalfantasywiki.com/w/api.php'

Add-Type -AssemblyName System.Drawing

function Read-Manifest {
  $source = Get-Content -Raw -LiteralPath $manifestPath
  $json = [regex]::Match($source, '=\s*(?<json>[\s\S]*);\s*$').Groups['json'].Value
  # Windows PowerShell 5.1 does not support ConvertFrom-Json -AsHashtable.
  $raw = $json | ConvertFrom-Json
  $manifest = [ordered]@{}
  foreach ($property in $raw.PSObject.Properties) {
    $manifest[$property.Name] = @($property.Value)
  }
  Write-Output -NoEnumerate $manifest
}

function Write-Manifest($manifest) {
  if (-not $manifest) { throw 'Image manifest could not be read; refusing to overwrite it.' }
  $json = $manifest | ConvertTo-Json -Depth 8
  "window.FINAL_FANTASY_TIMELINE_IMAGES = $json;`n" | Set-Content -LiteralPath $manifestPath -Encoding utf8
}

function Get-ImageInfo($fileTitle) {
  $url = "${api}?action=query&format=json&prop=imageinfo&iiprop=url&titles=$([uri]::EscapeDataString($fileTitle))"
  $result = Invoke-RestMethod -Uri $url -Headers $headers -TimeoutSec 30
  $page = $result.query.pages.PSObject.Properties.Value | Select-Object -First 1
  return $page.imageinfo[0].url
}

$pageTitleOverrides = @{
  'ff1' = 'Final Fantasy (video game)'
  'ff3d' = 'Final Fantasy III (3D remake)'
  'ff4-3d-remake' = 'Final Fantasy IV (3D remake)'
  'ff14-arr' = 'Final Fantasy XIV: A Realm Reborn'
  'ff11' = 'Final Fantasy XI'
  'ff-dimensions' = 'Final Fantasy Dimensions'
  'ff-dimensions-2' = 'Final Fantasy Legends: The Space-Time Crystal'
}
$fileTitleOverrides = @{
  'stranger-of-paradise' = 'File:Stranger_of_Paradise_logo.png'
  'ff7-ever-crisis' = 'File:Final_Fantasy_VII_Ever_Crisis_logo.png'
}

$source = Get-Content -Raw -LiteralPath $dataPath
$matches = [regex]::Matches($source, '\{ id: "(?<id>[^"]+)"[\s\S]*?name: "(?<name>[^"]+)"')
$manifest = Read-Manifest
$added = [System.Collections.Generic.List[string]]::new()
$missing = [System.Collections.Generic.List[string]]::new()

foreach ($match in $matches) {
  $id = $match.Groups['id'].Value
  $name = $match.Groups['name'].Value
  $key = "final-fantasy:$id"
  if ($manifest.Contains($key) -and @($manifest[$key]).Count -gt 0) { continue }
  $lookupTitle = if ($pageTitleOverrides.ContainsKey($id)) { $pageTitleOverrides[$id] } else { $name }

  try {
    $queryUrl = "${api}?action=query&format=json&redirects=1&prop=pageimages|images&pithumbsize=1000&imlimit=100&titles=$([uri]::EscapeDataString($lookupTitle))"
    $result = Invoke-RestMethod -Uri $queryUrl -Headers $headers -TimeoutSec 30
    $page = $result.query.pages.PSObject.Properties.Value | Select-Object -First 1
    $logo = @($page.images | Where-Object {
      $_.title -match '(?i)(logo|wordmark)' -and $_.title -notmatch '(?i)(wikipedia|construction)'
    } | Select-Object -First 1)[0]
    $fileTitle = if ($fileTitleOverrides.ContainsKey($id)) {
      $fileTitleOverrides[$id]
    } elseif ($logo) {
      $logo.title
    } elseif ($page.pageimage) {
      "File:$($page.pageimage)"
    } else {
      $null
    }
    if (-not $fileTitle) { $missing.Add($id); Start-Sleep -Seconds 3; continue }

    $imageUrl = Get-ImageInfo $fileTitle
    if (-not $imageUrl) { $missing.Add($id); Start-Sleep -Seconds 3; continue }
    $extension = [IO.Path]::GetExtension(([uri]$imageUrl).AbsolutePath).ToLowerInvariant()
    if ($extension -notin '.jpg', '.jpeg', '.png', '.webp', '.gif') { $extension = '.png' }
    if ($extension -eq '.jpeg') { $extension = '.jpg' }
    New-Item -ItemType Directory -Path $assetRoot -Force | Out-Null
    $filename = "$id-wiki$extension"
    $target = Join-Path $assetRoot $filename
    Invoke-WebRequest -Uri $imageUrl -Headers $headers -OutFile $target -TimeoutSec 45

    $image = [System.Drawing.Image]::FromFile((Resolve-Path $target))
    $valid = $image.Width -ge 80 -and $image.Height -ge 80
    $image.Dispose()
    if (-not $valid) { Remove-Item -LiteralPath $target -Force; $missing.Add($id); Start-Sleep -Seconds 3; continue }

    $manifest[$key] = @(@{
      id = "wiki-final-fantasy-$id"
      name = "$name - Final Fantasy Wiki"
      src = "timelines/final-fantasy/assets/covers/$filename"
    })
    $added.Add($id)
  } catch {
    $missing.Add($id)
  }
  # Community wiki rate limit: one title request cycle at a time.
  Start-Sleep -Seconds 3
}

Write-Manifest $manifest
[pscustomobject]@{ Added = $added; Missing = $missing; TotalManaged = @($manifest.Keys | Where-Object { $_ -like 'final-fantasy:*' -and @($manifest[$_]).Count -gt 0 }).Count } | ConvertTo-Json -Depth 4
