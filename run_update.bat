@echo off
setlocal enabledelayedexpansion

echo ===================================================
2: echo   Soul Blueprint Matrix - Database Update Launcher
3: echo ===================================================
4: echo.

set "PYTHON_CMD="

python --version >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "PYTHON_CMD=python"
    goto check_done
)

py --version >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "PYTHON_CMD=py"
    goto check_done
)

if exist "C:\Python313\python.exe" (
    set "PYTHON_CMD=C:\Python313\python.exe"
    goto check_done
)

for /f "usebackq tokens=2*" %%a in (`reg query "HKLM\Software\Python\PythonCore\3.13\InstallPath" /ve 2^>nul`) do (
    if exist "%%b\python.exe" (
        set "PYTHON_CMD=%%b\python.exe"
        goto check_done
    )
)

for /f "usebackq tokens=2*" %%a in (`reg query "HKCU\Software\Python\PythonCore\3.13\InstallPath" /ve 2^>nul`) do (
    if exist "%%b\python.exe" (
        set "PYTHON_CMD=%%b\python.exe"
        goto check_done
    )
)

if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python313\python.exe" (
    set "PYTHON_CMD=%USERPROFILE%\AppData\Local\Programs\Python\Python313\python.exe"
    goto check_done
)

:check_done
if not defined PYTHON_CMD (
    echo [ERROR] Python is not detected on your system.
    echo Please install Python, or make sure it is added to your PATH environment variable.
    echo.
    pause
    exit /b 1
)

:: Run the update script with --batch to pause at the end
"!PYTHON_CMD!" "%~dp0update_interpretations.py" --batch
