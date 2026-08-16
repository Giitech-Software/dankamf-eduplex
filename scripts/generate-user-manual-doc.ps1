$source = Join-Path $PSScriptRoot '..\docs\USER-MANUAL.md'
$destination = Join-Path $PSScriptRoot '..\docs\Dankamf-Enterprise-User-Manual.doc'
$lines = Get-Content -LiteralPath $source
function Escape-Rtf([string]$text) {
  $text.Replace('\','\\').Replace('{','\{').Replace('}','\}')
}
$body = New-Object System.Text.StringBuilder
foreach ($line in $lines) {
  if ([string]::IsNullOrWhiteSpace($line)) { [void]$body.AppendLine('\par'); continue }
  $clean = $line -replace '^#+\s*','' -replace '^[-*]\s*','• '
  if ($line -match '^#\s+') { [void]$body.AppendLine("\fs36\b $(Escape-Rtf $clean)\b0\fs24\par") }
  elseif ($line -match '^##\s+') { [void]$body.AppendLine("\fs30\b $(Escape-Rtf $clean)\b0\fs24\par") }
  elseif ($line -match '^###\s+') { [void]$body.AppendLine("\fs26\b $(Escape-Rtf $clean)\b0\fs24\par") }
  elseif ($line -match '^---$') { [void]$body.AppendLine('\brdrb\brdrs\brdrw10\brsp20\par') }
  else { [void]$body.AppendLine("$(Escape-Rtf $clean)\par") }
}
$rtf = "{\rtf1\ansi\deff0{\fonttbl{\f0 Aptos;}}\viewkind4\uc1\f0\fs24\sa120\sl276\slmult1 $body}"
Set-Content -LiteralPath $destination -Value $rtf -Encoding UTF8
Write-Output $destination
