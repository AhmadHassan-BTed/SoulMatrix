@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   Soul Blueprint Matrix - Release Build Launcher
echo ===================================================
echo.

set "VERSION=1.2.0"
set "PYTHON_CMD="

:detect_python
:: 1. Check if 'python' is in PATH
python --version >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "PYTHON_CMD=python"
    goto check_done
)

:: 2. Check standard 'py' launcher
py --version >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "PYTHON_CMD=py"
    goto check_done
)

:: 3. Check AppData local directory
if exist "%USERPROFILE%\AppData\Local\Programs\Python" (
    for /f "delims=" %%d in ('dir /b /ad /o-n "%USERPROFILE%\AppData\Local\Programs\Python\Python*" 2^>nul') do (
        (
            if exist "%USERPROFILE%\AppData\Local\Programs\Python\%%d\python.exe" (
                set "PYTHON_CMD=%USERPROFILE%\AppData\Local\Programs\Python\%%d\python.exe"
                goto check_done
            )
        ) 2>nul
    )
)

:check_done
if defined PYTHON_CMD (
    echo [OK] Python detected: !PYTHON_CMD!
    echo Running compilation & release packager...
    echo.
    "!PYTHON_CMD!" "%~dp0tools\package_release.py"
    goto end
)

:: Fallback if Python is not installed
echo [INFO] Python not detected. Running built-in Windows PowerShell fallback build...
echo.
echo [STEP 1/2] Compiling database via PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\update_interpretations.ps1" -Batch

echo.
echo [STEP 2/2] Packaging release zip via PowerShell...
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set TIMESTAMP=!datetime:~0,8!_!datetime:~8,6!
set ZIP_NAME=SoulMatrix_v!VERSION!_!TIMESTAMP!.zip

powershell -NoProfile -ExecutionPolicy Bypass -Command "^
    $files = @('src\soul_matrix.html','src\script_board.html','src\server.py','src\server.ps1','data\interpretations.xlsx','data\interpretations.csv','data\interpretations_deep.xlsx','data\interpretations_deep.csv','tools\update_interpretations.py','tools\update_interpretations.ps1','run_locally.bat','run_update.bat','build_release.bat','README.md','HOW-TO-UPDATE.md','CHANGELOG.md'); ^
    $validFiles = $files | Where-Object { Test-Path $_ }; ^
    Compress-Archive -Path $validFiles -DestinationPath '!ZIP_NAME!' -Force; ^
    Copy-Item '!ZIP_NAME!' 'SoulMatrix_v!VERSION!_Latest.zip' -Force; ^
    Write-Host '[OK] Package created: !ZIP_NAME!' -ForegroundColor Green"


:end
echo.
pause
