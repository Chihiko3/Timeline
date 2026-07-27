$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$releasePath = Join-Path $root "timelines\SpikeSeries\releases.js"
$manifestPath = Join-Path $root "timelines\SpikeSeries\timeline-images.js"
$outputDirectory = Join-Path $root "timelines\SpikeSeries\assets\covers"
$headers = @{ "User-Agent" = "GameTimelineArchive/1.0 (personal research archive)" }

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$releaseSource = Get-Content -LiteralPath $releasePath -Raw -Encoding UTF8
$releaseMatches = [regex]::Matches(
  $releaseSource,
  '\{\s*id:"(?<id>[^"]+)".*?name:"(?<name>[^"]+)".*?\}'
)
$releases = foreach ($match in $releaseMatches) {
  [pscustomobject]@{
    Id = $match.Groups["id"].Value
    Name = $match.Groups["name"].Value
  }
}

$manifest = [ordered]@{}
if (Test-Path -LiteralPath $manifestPath) {
  $existingSource = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8
  $existingMatch = [regex]::Match($existingSource, '=\s*(?<json>[\s\S]*);\s*$')
  if ($existingMatch.Success) {
    $existingManifest = $existingMatch.Groups["json"].Value | ConvertFrom-Json
    foreach ($property in $existingManifest.psobject.Properties) {
      $manifest[$property.Name] = @($property.Value)
    }
  }
}

function Get-WikipediaArtwork {
  param([string]$Query)

  $searchParameters = @{
    action = "query"
    generator = "search"
    gsrsearch = "$Query video game"
    gsrlimit = "3"
    gsrnamespace = "0"
    prop = "info"
    inprop = "url"
    format = "json"
  }
  $searchUri = "https://en.wikipedia.org/w/api.php?" + (
    $searchParameters.GetEnumerator() |
      ForEach-Object { "$([uri]::EscapeDataString($_.Key))=$([uri]::EscapeDataString([string]$_.Value))" }
  ) -join "&"
  $search = Invoke-RestMethod -Uri $searchUri -Headers $headers -TimeoutSec 15
  $article = @($search.query.pages.psobject.Properties.Value)[0]
  if (-not $article) { return $null }

  $imageParameters = @{
    action = "query"
    generator = "images"
    titles = $article.title
    gimlimit = "40"
    prop = "imageinfo"
    iiprop = "url"
    iiurlwidth = "1000"
    format = "json"
  }
  $imageUri = "https://en.wikipedia.org/w/api.php?" + (
    $imageParameters.GetEnumerator() |
      ForEach-Object { "$([uri]::EscapeDataString($_.Key))=$([uri]::EscapeDataString([string]$_.Value))" }
  ) -join "&"
  $imagesResponse = Invoke-RestMethod -Uri $imageUri -Headers $headers -TimeoutSec 15
  $images = @($imagesResponse.query.pages.psobject.Properties.Value) |
    Where-Object { $_.imageinfo[0].thumburl -or $_.imageinfo[0].url }
  $preferred = $images |
    Where-Object {
      $_.title -match '(?i)box|cover|package|jacket|logo|title' -and
      $_.title -notmatch '(?i)gameplay|screenshot|symbol|icon|map|actor|actress'
    } |
    Select-Object -First 1
  if (-not $preferred) {
    $preferred = $images |
      Where-Object { $_.title -notmatch '(?i)gameplay|screenshot|symbol|icon|map|actor|actress' } |
      Select-Object -First 1
  }
  if (-not $preferred) { return $null }

  [pscustomobject]@{
    Article = $article.title
    ImageTitle = $preferred.title
    Url = if ($preferred.imageinfo[0].thumburl) {
      $preferred.imageinfo[0].thumburl
    } else {
      $preferred.imageinfo[0].url
    }
  }
}

foreach ($release in $releases) {
  $key = "spike-series:$($release.Id)"
  if ($manifest.Contains($key) -and @($manifest[$key]).Count -gt 0) {
    Write-Output "keep  $($release.Id)"
    continue
  }
  try {
    $artwork = Get-WikipediaArtwork -Query $release.Name
    if (-not $artwork) {
      Write-Output "miss  $($release.Id) $($release.Name)"
      continue
    }

    $extension = [IO.Path]::GetExtension(([uri]$artwork.Url).AbsolutePath).ToLowerInvariant()
    if ($extension -notin @(".jpg", ".jpeg", ".png", ".webp")) { $extension = ".jpg" }
    $filename = "$($release.Id)-01$extension"
    $target = Join-Path $outputDirectory $filename
    Invoke-WebRequest -Uri $artwork.Url -Headers $headers -TimeoutSec 20 -OutFile $target

    $manifest[$key] = @(
      [ordered]@{
        id = "spike-$($release.Id)-01"
        name = "$($release.Name) reference artwork"
        src = "timelines/SpikeSeries/assets/covers/$filename"
      }
    )
    Write-Output "saved $($release.Id) <- $($artwork.Article) / $($artwork.ImageTitle)"
  } catch {
    Write-Output "skip  $($release.Id) ($($_.Exception.Message))"
  }
  Start-Sleep -Milliseconds 180
}

$json = $manifest | ConvertTo-Json -Depth 8
$source = "window.SPIKE_SERIES_TIMELINE_IMAGES = $json;`n"
Set-Content -LiteralPath $manifestPath -Value $source -Encoding UTF8
Write-Output "Generated $manifestPath with $($manifest.Count) images."
