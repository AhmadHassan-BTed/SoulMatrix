param(
    [switch]$Batch
)

$ErrorActionPreference = "Stop"

# Paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$dataDir = Join-Path $projectRoot "data"
$excelPath = Join-Path $dataDir "interpretations.xlsx"
$csvPath = Join-Path $dataDir "interpretations.csv"
$backupDir = Join-Path $scriptDir "backups"

# Find Excel file
if (-not (Test-Path $excelPath)) {
    $excelPath = Join-Path $dataDir "Interpretations.xlsx"
    if (-not (Test-Path $excelPath)) {
        Write-Host "[ERROR] Could not find interpretations.xlsx spreadsheet in $dataDir" -ForegroundColor Red
        if ($Batch) { Read-Host "Press Enter to exit..." }
        exit 1
    }
}

Write-Host "Found Excel database: $excelPath" -ForegroundColor Cyan

# Create Backup
if (Test-Path $csvPath) {
    if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
    $timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
    $backupPath = Join-Path $backupDir "interpretations_backup_$timestamp.csv"
    Copy-Item $csvPath $backupPath
    Write-Host "[OK] Pre-existing CSV backed up to: $backupPath" -ForegroundColor Green
}

# Load Excel COM
Write-Host "Initializing Excel COM automation..." -ForegroundColor Cyan
try {
    $excel = New-Object -ComObject Excel.Application
} catch {
    Write-Host "[ERROR] Failed to start Excel COM. Excel must be installed on the system." -ForegroundColor Red
    Write-Host "Details: $_" -ForegroundColor Red
    if ($Batch) { Read-Host "Press Enter to exit..." }
    exit 1
}

try {
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
} catch {
    Write-Host "[WARNING] Could not set Excel visibility properties, proceeding..." -ForegroundColor Yellow
}

try {
    $workbook = $excel.Workbooks.Open($excelPath, [Type]::Missing, $true) # read-only = true
} catch {
    Write-Host "[ERROR] Failed to open workbook. Make sure the file is not locked." -ForegroundColor Red
    try { $excel.Quit() } catch {}
    try { [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null } catch {}
    if ($Batch) { Read-Host "Press Enter to exit..." }
    exit 1
}

# Helper to find column index
function Get-ColIndices($sheet, $requiredCols) {
    $indices = @{}
    
    # Look in first 20 columns of row 1
    foreach ($colKey in $requiredCols.Keys) {
        $aliases = $requiredCols[$colKey]
        $foundIdx = $null
        
        for ($col = 1; $col -le 20; $col++) {
            $val = $sheet.Cells.Item(1, $col).Value2
            if ($null -ne $val) {
                $valStr = ([string]$val).Trim().ToLower()
                foreach ($alias in $aliases) {
                    if ($valStr -eq $alias) {
                        $foundIdx = $col
                        break
                    }
                }
                if ($null -ne $foundIdx) { break }
            }
        }
        
        # Fallback partial matching
        if ($null -eq $foundIdx) {
            for ($col = 1; $col -le 20; $col++) {
                $val = $sheet.Cells.Item(1, $col).Value2
                if ($null -ne $val) {
                    $valStr = ([string]$val).Trim().ToLower()
                    foreach ($alias in $aliases) {
                        if ($valStr.Contains($alias)) {
                            $foundIdx = $col
                            break
                        }
                    }
                    if ($null -ne $foundIdx) { break }
                }
            }
        }
        
        if ($null -eq $foundIdx) {
            return $null
        }
        $indices[$colKey] = $foundIdx
    }
    return $indices
}

# Mapping logic in PS
function Map-ExcelToCsvColumns($pos, $posMeaning, $excelSection, $isCompat) {
    $pos = ([string]$pos).Trim()
    $excelSection = ([string]$excelSection).Trim()
    
    $posUpper = $pos.ToUpper().Replace(" ", "")
    
    if ($posUpper -eq "FORECAST") {
        $secLower = $excelSection.ToLower().Trim()
        $section = "theme"
        if ($secLower.Contains("watch") -or $secLower.Contains("trap") -or $secLower.Contains("risk")) {
            $section = "watch_out"
        } elseif ($secLower.Contains("recommendation") -or $secLower.Contains("rec") -or $secLower.Contains("unlock")) {
            $section = "recommendations"
        }
        return @("FORECAST", "forecast", $section)
    }
    
    if ($posUpper -eq "COMPAT_FORECAST" -or $posUpper -eq "COMPATFORECAST") {
        $secLower = $excelSection.ToLower().Trim()
        $section = "theme"
        if ($secLower.Contains("watch") -or $secLower.Contains("trap") -or $secLower.Contains("risk")) {
            $section = "watch_out"
        } elseif ($secLower.Contains("recommendation") -or $secLower.Contains("rec") -or $secLower.Contains("unlock")) {
            $section = "recommendations"
        }
        return @("COMPAT_FORECAST", "compat_forecast", $section)
    }
    
    $isAge = $posUpper.StartsWith("AGE")
    
    if ($isAge) {
        $ageNumStr = $posUpper.Substring(3).Replace(",", ".")
        $posClean = "age$ageNumStr"
        $module = "forecast"
        $secLower = $excelSection.ToLower().Trim()
        if ($secLower -eq "interpretation" -or $secLower -eq "") {
            $section = "yearly"
        } else {
            $section = $secLower.Replace(" ", "_").Trim("_")
            if (-not $section) { $section = "yearly" }
        }
        if ($isCompat) {
            $module = "compat_$module"
        }
        return @($posClean, $module, $section)
    }
    
    $posUpper = $pos.ToUpper()
    $isProgram = $pos.Contains("-") -or $pos.Contains(",") -or $posUpper -eq "PROGRAM"
    if ($isProgram) {
        if ($isCompat) { $module = "compat_programs" } else { $module = "programs" }
        $section = $excelSection.ToLower().Replace(" ", "_").Trim("_")
        if (-not $section) { $section = "program_meaning" }
        return @($pos.ToUpper(), $module, $section)
    }
    
    $secLower = $excelSection.ToLower().Trim()
    
    if ($isCompat) {
        if ($secLower.Contains("general") -or $secLower -eq "interpretation" -or $secLower -eq "") {
            return @($posUpper, "compat_general", "meaning")
        } elseif ($secLower.Contains("love") -or $secLower.Contains("relationship")) {
            return @($posUpper, "compat_love", "meaning")
        } elseif ($secLower.Contains("karma")) {
            return @($posUpper, "compat_karma", "meaning")
        } elseif ($secLower.Contains("finance") -or $secLower.Contains("money") -or $secLower.Contains("wealth")) {
            return @($posUpper, "compat_finance", "meaning")
        } elseif ($secLower.Contains("forecast") -or $secLower.Contains("yearly")) {
            return @($posUpper, "compat_forecast", "yearly")
        } else {
            $module = "compat_" + $secLower.Replace(" ", "_").Trim("_")
            if (-not $module -or $module -eq "compat_") { $module = "compat_general" }
            return @($posUpper, $module, "meaning")
        }
    }
    
    # Single DOB
    if ($secLower -eq "interpretation" -or -not $secLower) {
        $defaultMap = @{
            "B" = @("core", "meaning"); "C" = @("core", "meaning"); "D" = @("core", "meaning")
            "E" = @("core", "meaning"); "F" = @("core", "meaning"); "F2" = @("core", "meaning")
            "G" = @("core", "meaning"); "G2" = @("core", "meaning"); "H" = @("core", "meaning")
            "H1" = @("core", "meaning"); "I" = @("core", "meaning"); "I1" = @("core", "meaning")
            "J" = @("core", "meaning"); "K" = @("purpose", "gifts"); "L" = @("relationships", "lesson")
            "M" = @("relationships", "partner"); "N" = @("karma", "karmic"); "O" = @("core", "meaning")
            "P" = @("core", "meaning"); "Q" = @("core", "meaning"); "R" = @("relationships", "meaning")
            "R1" = @("relationships", "partner"); "R2" = @("money", "activation"); "S" = @("relationships", "wound")
            "T" = @("relationships", "meaning")
        }
        if ($defaultMap.ContainsKey($posUpper)) {
            $moduleSection = $defaultMap[$posUpper]
            $module = $moduleSection[0]
            $section = $moduleSection[1]
        } else {
            $module = "core"
            $section = "meaning"
        }
        return @($posUpper, $module, $section)
    }
    
    $cleanSec = $secLower -replace '[^a-z0-9\s]', ' '
    $cleanSec = ($cleanSec -split '\s+' | Where-Object { $_ }) -join ' '
    
    if ($posUpper -eq 'R1' -or $posUpper -eq 'L' -or $posUpper -eq 'M' -or $posUpper -eq 'S') {
        $module = "relationships"
    } elseif ($posUpper -eq 'R2') {
        $module = "money"
    } elseif ($posUpper -eq 'N') {
        $module = "karma"
    } elseif ($cleanSec.Contains("relationship") -or $cleanSec.Contains("love")) {
        $module = "relationships"
    } elseif ($cleanSec.Contains("karma")) {
        $module = "karma"
    } elseif ($cleanSec.Contains("money") -or $cleanSec.Contains("finance") -or $cleanSec.Contains("wealth")) {
        $module = "money"
    } elseif ($cleanSec.Contains("purpose")) {
        $module = "purpose"
    } elseif ($cleanSec.Contains("forecast")) {
        $module = "forecast"
    } else {
        if ($posUpper -eq 'R') { $module = "relationships" } else { $module = "core" }
    }
    
    if ($cleanSec -match 'problem|problems|wound|wounds|crisis|block|blocks|challenge|shadow') {
        if ($module -eq 'relationships') { $section = "wound" }
        elseif ($module -eq 'money') { $section = "block" }
        else { $section = "shadow" }
    } elseif ($cleanSec -match 'partner|partners|attract|attraction|dynamics') {
        $section = "partner"
    } elseif ($cleanSec -match 'lesson|lessons') {
        $section = "lesson"
    } elseif ($cleanSec -match 'money_flow|flow|income') {
        $section = "money_flow"
    } elseif ($cleanSec -match 'activation|activate') {
        $section = "activation"
    } elseif ($cleanSec -match 'positive|gift|gifts') {
        if ($module -eq 'core') { $section = "positive" } else { $section = "gifts" }
    } elseif ($cleanSec -match 'meaning|general|interpretation|description') {
        $section = "meaning"
    } else {
        $sectionPart = $cleanSec
        foreach ($kw in @('relationships', 'relationship', 'love', 'money', 'finance', 'karma', 'core', 'purpose', 'forecast')) {
            $sectionPart = $sectionPart.Replace($kw, '').Trim()
        }
        $section = $sectionPart.Replace(" ", "_").Trim("_")
        if (-not $section) {
            if ($module -eq 'relationships') { $section = "partner" } else { $section = "meaning" }
        }
    }
    
    return @($posUpper, $module, $section)
}

# Helper to escape CSV strings
function Escape-CsvField($val) {
    if ($null -eq $val) { return '""' }
    $valStr = [string]$val
    if ($valStr.Contains('"') -or $valStr.Contains(',') -or $valStr.Contains("`n") -or $valStr.Contains("`r")) {
        return '"' + $valStr.Replace('"', '""') + '"'
    }
    return $valStr
}

# Select sheets to process
$sheetsToProcess = @()
$singleSheetName = "Master_Database"
$hasMaster = $false
foreach ($s in $workbook.Sheets) {
    if ($s.Name -eq "Master_Database") {
        $hasMaster = $true
        break
    }
}
if (-not $hasMaster) {
    $singleSheetName = $workbook.Sheets.Item(1).Name
}
$sheetsToProcess += @( @($singleSheetName, $false) )

$compatSheetName = $null
foreach ($s in $workbook.Sheets) {
    if ($s.Name -eq "Compatibility") {
        $compatSheetName = "Compatibility"
        break
    }
}
if ($null -eq $compatSheetName) {
    foreach ($s in $workbook.Sheets) {
        if ($s.Name.ToLower() -ne $singleSheetName.ToLower() -and $s.Name.ToLower().Contains("compat")) {
            $compatSheetName = $s.Name
            break
        }
    }
}

if ($null -ne $compatSheetName) {
    $sheetsToProcess += @( @($compatSheetName, $true) )
    Write-Host "[INFO] Found compatibility sheet: '$compatSheetName'" -ForegroundColor Cyan
}

$requiredCols = @{
    "position" = @("position", "pos", "node")
    "position meaning" = @("position meaning", "meaning", "description")
    "section" = @("section", "category", "tab")
    "number" = @("number", "val", "num", "key")
    "interpretation text" = @("interpretation text", "text", "content", "interpretation")
}

$csvLines = @()
$csvLines += "position,module,section,number,text"

$mappedCount = 0
$emptyCount = 0
$invalidRows = @()
$activePositions = [System.Collections.Generic.HashSet[string]]::new()

foreach ($sheetInfo in $sheetsToProcess) {
    $sheetName = $sheetInfo[0]
    $isCompat = $sheetInfo[1]
    
    Write-Host "[INFO] Reading sheet: '$sheetName'" -ForegroundColor Cyan
    $sheet = $workbook.Sheets.Item($sheetName)
    
    $usedRange = $sheet.UsedRange
    $rowsCount = $usedRange.Rows.Count
    if ($rowsCount -lt 2) {
        Write-Host "[WARNING] Sheet '$sheetName' has no data rows." -ForegroundColor Yellow
        continue
    }
    
    $colIndices = Get-ColIndices $sheet $requiredCols
    if ($null -eq $colIndices) {
        Write-Host "[ERROR] Could not find all required columns (Position, Section, Number, Interpretation Text) in sheet '$sheetName'." -ForegroundColor Red
        $workbook.Close($false)
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
        if ($Batch) { Read-Host "Press Enter to exit..." }
        exit 1
    }
    
    $posIdx = $colIndices["position"]
    $meaningIdx = $colIndices["position meaning"]
    $secIdx = $colIndices["section"]
    $numIdx = $colIndices["number"]
    $textIdx = $colIndices["interpretation text"]
    
    for ($r = 2; $r -le $rowsCount; $r++) {
        $pVal = $sheet.Cells.Item($r, $posIdx).Value2
        $pMean = $sheet.Cells.Item($r, $meaningIdx).Value2
        $secVal = $sheet.Cells.Item($r, $secIdx).Value2
        $numVal = $sheet.Cells.Item($r, $numIdx).Value2
        $textVal = $sheet.Cells.Item($r, $textIdx).Value2
        
        if ($null -eq $pVal -or ([string]$pVal).Trim() -eq "") { continue }
        if ($null -eq $textVal -or ([string]$textVal).Trim() -eq "") {
            $emptyCount++
            continue
        }
        
        $pValStr = ([string]$pVal).Trim()
        $isAge = $pValStr.ToUpper().Replace(" ", "").StartsWith("AGE")
        $isProgram = (-not $isAge) -and ($pValStr.Contains("-") -or $pValStr.Contains(",") -or $pValStr.ToUpper() -eq "PROGRAM")
        
        $num = ""
        if ($isProgram -or $isAge) {
            if ($isAge) {
                try {
                    $num = [int][double]$numVal
                } catch {
                    $num = ([string]$numVal).Trim()
                }
            } else {
                $num = ([string]$numVal).Trim()
            }
        } else {
            try {
                $num = [int][double]$numVal
            } catch {
                $invalidRows += @( @($sheetName, $r, $numVal, $pValStr) )
                continue
            }
        }
        
        $mapped = Map-ExcelToCsvColumns $pValStr $pMean $secVal $isCompat
        $pos = $mapped[0]
        $module = $mapped[1]
        $section = $mapped[2]
        
        $textClean = ([string]$textVal).Trim()
        
        $csvLine = "$(Escape-CsvField $pos),$(Escape-CsvField $module),$(Escape-CsvField $section),$(Escape-CsvField $num),$(Escape-CsvField $textClean)"
        $csvLines += $csvLine
        $mappedCount++
        $activePositions.Add($pos) | Out-Null
    }
}

# Close workbook and excel
$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

# Write to CSV in UTF8
$csvContentText = [string]::Join("`r`n", $csvLines)
[System.IO.File]::WriteAllText($csvPath, $csvContentText, [System.Text.Encoding]::UTF8)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "                      SUCCESSFUL SYNC" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "[OK] Database updated: $csvPath" -ForegroundColor Green
Write-Host "[OK] Total rows imported: $mappedCount" -ForegroundColor Green
Write-Host "[OK] Empty rows skipped: $emptyCount" -ForegroundColor Green
Write-Host "[OK] Positions synced: $([string]::Join(', ', ($activePositions | Sort-Object)))" -ForegroundColor Green

if ($invalidRows.Count -gt 0) {
    Write-Host "[WARNING] Skipped $($invalidRows.Count) rows due to invalid 'Number' values:" -ForegroundColor Yellow
    foreach ($row in $invalidRows | Select-Object -First 5) {
        Write-Host "  - Sheet '$($row[0])', Row $($row[1]): Number='$($row[2])' (Position $($row[3]))" -ForegroundColor Yellow
    }
    if ($invalidRows.Count -gt 5) {
        Write-Host "  - ... and $($invalidRows.Count - 5) more rows." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Workflow ready. You can now reload your Soul Blueprint Matrix in Chrome." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

if ($Batch) {
    Read-Host "Press Enter to exit..."
}
