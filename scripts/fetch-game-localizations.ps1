$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$node = 'C:\Users\LiuMa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$namesScript = @"
global.window={};
require('./curated-games.js');
const names=[...new Set(Object.values(window.CONSOLE_CURATED_GAMES).flatMap(x=>[...(x.launchGames||[]),...(x.signatureGames||[])]))].sort((a,b)=>a.localeCompare(b,'en'));
process.stdout.write(JSON.stringify(names));
"@
$gameNames = (& $node -e $namesScript | ConvertFrom-Json)
$headers = @{ 'User-Agent' = 'GameConsoleArchiveLocal/1.0 (personal local archive)' }
$batchSize = 50
$candidates = @{}

function Invoke-WikiRequest($url) {
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    try {
      return Invoke-RestMethod -Uri $url -Headers $headers -TimeoutSec 30
    } catch {
      if ($attempt -eq 3) { throw }
      Start-Sleep -Seconds ($attempt * 10)
    }
  }
}

function Get-WikipediaBatch($titles) {
  $encodedTitles = [uri]::EscapeDataString(($titles -join '|'))
  $url = "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1&prop=langlinks%7Cinfo%7Cpageprops&inprop=url&lllang=zh&lllimit=max&titles=$encodedTitles"
  return Invoke-WikiRequest $url
}

function Get-WikidataBatch($ids) {
  $encodedIds = [uri]::EscapeDataString(($ids -join '|'))
  $url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=$encodedIds"
  return Invoke-WikiRequest $url
}

for ($index = 0; $index -lt $gameNames.Count; $index += $batchSize) {
  $end = [Math]::Min($index + $batchSize - 1, $gameNames.Count - 1)
  $batch = @($gameNames[$index..$end])
  $payload = Get-WikipediaBatch $batch
  $byTitle = @{}

  foreach ($page in $payload.query.pages) {
    if ($page.missing -or -not $page.pageprops.wikibase_item) { continue }
    $chinese = @($page.langlinks | Where-Object { $_.lang -eq 'zh' }) | Select-Object -First 1
    $chineseTitle = $chinese.title
    if (-not $chineseTitle) { $chineseTitle = $chinese.'*' }
    $byTitle[$page.title] = [ordered]@{
      chineseTitle = $chineseTitle
      url = $page.fullurl
      wikidataId = $page.pageprops.wikibase_item
    }
  }

  foreach ($redirect in @($payload.query.normalized) + @($payload.query.redirects)) {
    if ($redirect -and $byTitle.ContainsKey($redirect.to)) {
      $byTitle[$redirect.from] = $byTitle[$redirect.to]
    }
  }

  foreach ($game in $batch) {
    if ($byTitle.ContainsKey($game)) { $candidates[$game] = $byTitle[$game] }
  }
  Write-Output "Resolved $($end + 1) / $($gameNames.Count)"
  Start-Sleep -Seconds 3
}

$videoGameIds = [System.Collections.Generic.HashSet[string]]::new()
$candidateIds = @($candidates.Values | ForEach-Object { $_.wikidataId } | Sort-Object -Unique)
for ($index = 0; $index -lt $candidateIds.Count; $index += $batchSize) {
  $end = [Math]::Min($index + $batchSize - 1, $candidateIds.Count - 1)
  $payload = Get-WikidataBatch @($candidateIds[$index..$end])
  foreach ($entity in $payload.entities.psobject.Properties.Value) {
    $instanceOf = @($entity.claims.P31 | ForEach-Object { $_.mainsnak.datavalue.value.id })
    if ($instanceOf -contains 'Q7889') { [void]$videoGameIds.Add($entity.id) }
  }
  Write-Output "Verified $($end + 1) / $($candidateIds.Count)"
  Start-Sleep -Seconds 3
}

$localizations = [ordered]@{}
foreach ($game in $gameNames) {
  $candidate = $candidates[$game]
  if ($candidate -and $videoGameIds.Contains($candidate.wikidataId)) {
    $localizations[$game] = [ordered]@{
      chineseTitle = $candidate.chineseTitle
      url = $candidate.url
    }
  }
}

$json = $localizations | ConvertTo-Json -Depth 5
$output = "window.CONSOLE_GAME_LOCALIZATIONS = $json;`n"
[System.IO.File]::WriteAllText((Join-Path $root 'game-localizations.js'), $output, [System.Text.UTF8Encoding]::new($false))
$chineseCount = @($localizations.Values | Where-Object { $_.chineseTitle }).Count
Write-Output "Wrote $($localizations.Count) verified game links ($chineseCount Chinese names)."
