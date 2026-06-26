@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   Soul Blueprint Matrix - Database Update Launcher
echo ===================================================
echo.

set "PYTHON_CMD="

:detect_python
:: 1. Check if 'python' is in PATH
python -c "import sys; sys.exit(0 if sys.version_info[0] == 3 else 1)" >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "PYTHON_CMD=python"
    goto check_done
)

:: 2. Check if standard launcher 'py' is in PATH and working
py -3 -c "import sys; sys.exit(0)" >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "PYTHON_CMD=py -3"
    goto check_done
)

:: 3. Check common Python versions in AppData local directory
if exist "%USERPROFILE%\AppData\Local\Programs\Python" (
    for /f "delims=" %%d in ('dir /b /ad /o-n "%USERPROFILE%\AppData\Local\Programs\Python\Python*" 2^>nul') do (
        (
            if exist "%USERPROFILE%\AppData\Local\Programs\Python\%%d\python.exe" (
                "%USERPROFILE%\AppData\Local\Programs\Python\%%d\python.exe" -c "import sys; sys.exit(0)" >nul 2>&1
                if !ERRORLEVEL! equ 0 (
                    set "PYTHON_CMD=%USERPROFILE%\AppData\Local\Programs\Python\%%d\python.exe"
                    goto check_done
                )
            )
        ) 2>nul
    )
)

:: 4. Check registry for any installed PythonCore (HKLM & HKCU)
for /f "tokens=*" %%k in ('reg query "HKLM\Software\Python\PythonCore" 2^>nul') do (
    for /f "usebackq tokens=2*" %%a in (`reg query "%%k\InstallPath" /ve 2^>nul`) do (
        (
            if exist "%%b\python.exe" (
                "%%b\python.exe" -c "import sys; sys.exit(0)" >nul 2>&1
                if !ERRORLEVEL! equ 0 (
                    set "PYTHON_CMD=%%b\python.exe"
                    goto check_done
                )
            )
        ) 2>nul
    )
)

for /f "tokens=*" %%k in ('reg query "HKCU\Software\Python\PythonCore" 2^>nul') do (
    for /f "usebackq tokens=2*" %%a in (`reg query "%%k\InstallPath" /ve 2^>nul`) do (
        (
            if exist "%%b\python.exe" (
                "%%b\python.exe" -c "import sys; sys.exit(0)" >nul 2>&1
                if !ERRORLEVEL! equ 0 (
                    set "PYTHON_CMD=%%b\python.exe"
                    goto check_done
                )
            )
        ) 2>nul
    )
)

:: 5. Check C:\Python* folders
if exist "C:\Python*" (
    for /f "delims=" %%d in ('dir /b /ad /o-n "C:\Python*" 2^>nul') do (
        (
            if exist "C:\%%d\python.exe" (
                "C:\%%d\python.exe" -c "import sys; sys.exit(0)" >nul 2>&1
                if !ERRORLEVEL! equ 0 (
                    set "PYTHON_CMD=C:\%%d\python.exe"
                    goto check_done
                )
            )
        ) 2>nul
    )
)

:check_done
if defined PYTHON_CMD (
    echo [OK] Python detected: !PYTHON_CMD!
    goto run_sync
)

:: Python not found, attempt automatic installation
echo [INFO] Python is not detected on your system.
echo Attempting to install Python automatically via winget...
echo.

winget install --id Python.Python.3 --exact --accept-source-agreements --accept-package-agreements
if !ERRORLEVEL! neq 0 (
    echo.
    echo [WARNING] Automatic Python installation via winget failed.
    echo.
    echo Falling back to the built-in Windows PowerShell database synchronizer...
    echo (Note: This requires Microsoft Excel to be installed on your computer).
    echo.
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\update_interpretations.ps1" -Batch
    exit /b !ERRORLEVEL!
)

echo.
echo Python installation completed successfully! Re-detecting...
echo.
goto detect_python

:run_sync
:: Verify openpyxl is installed
"!PYTHON_CMD!" -c "import openpyxl" >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo [INFO] Installing required library 'openpyxl'...
    "!PYTHON_CMD!" -m pip install openpyxl
    if !ERRORLEVEL! neq 0 (
        echo.
        echo [WARNING] Failed to install 'openpyxl' python library.
        echo Falling back to PowerShell database synchronizer...
        powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\update_interpretations.ps1" -Batch
        exit /b !ERRORLEVEL!
    )
)

:: Run the update script with --batch to pause at the end
"!PYTHON_CMD!" "%~dp0tools\update_interpretations.py" --batch
if !ERRORLEVEL! neq 0 (
    echo.
    echo [WARNING] Python database sync failed.
    echo Falling back to PowerShell database synchronizer...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\update_interpretations.ps1" -Batch
    exit /b !ERRORLEVEL!
)
