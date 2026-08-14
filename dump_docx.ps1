param([string]$Path)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($Path, [ref]0, [ref]$true)

Write-Host $doc.Content.Text

# Also dump any tables explicitly since Content.Text sometimes mangles table layout
$tableCount = $doc.Tables.Count
if ($tableCount -gt 0) {
  Write-Host "`n=====TABLES ($tableCount)====="
  for ($t = 1; $t -le $tableCount; $t++) {
    $tbl = $doc.Tables.Item($t)
    Write-Host "--- Table $t ---"
    for ($r = 1; $r -le $tbl.Rows.Count; $r++) {
      $cells = @()
      for ($c = 1; $c -le $tbl.Columns.Count; $c++) {
        try {
          $cellText = $tbl.Cell($r, $c).Range.Text
          $cellText = $cellText -replace "[\x07\x0d]+", " "
          $cells += $cellText.Trim()
        } catch { $cells += "" }
      }
      Write-Host ($cells -join " | ")
    }
  }
}

$doc.Close($false)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
