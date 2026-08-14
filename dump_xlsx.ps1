param([string]$Path)

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open($Path, 0, $true)

foreach ($ws in $wb.Worksheets) {
  Write-Host "=====SHEET: $($ws.Name)====="
  $used = $ws.UsedRange
  $rows = $used.Rows.Count
  $cols = $used.Columns.Count
  for ($r = 1; $r -le $rows; $r++) {
    $rowVals = @()
    for ($c = 1; $c -le $cols; $c++) {
      $cell = $used.Cells.Item($r, $c)
      $val = $cell.Text
      $rowVals += $val
    }
    Write-Host ($rowVals -join " | ")
  }
  Write-Host ""
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
