@echo off
setlocal enabledelayedexpansion

:: Check if the files are extracted from ZIP first
if not exist "%~dp0src\soul_matrix.html" goto err_not_extracted
if not exist "%~dp0src\server.ps1" goto err_not_extracted

echo ===================================================
echo   Soul Blueprint Matrix - Local Web Server Launcher
echo ===================================================
echo.

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
if defined PYTHON_CMD (
    echo [OK] Python is available: !PYTHON_CMD!
    goto run_server
)

echo [INFO] Python is not detected. Installing Python automatically...
echo.
winget install --id Python.Python.3 --exact --accept-source-agreements --accept-package-agreements
if !ERRORLEVEL! neq 0 (
    echo.
    echo [WARNING] Automatic Python installation via winget failed.
    echo Falling back to the built-in PowerShell server...
    echo.
    goto run_ps
)

echo.
echo Python installation completed successfully! Detecting Python path...
echo.

py --version >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "PYTHON_CMD=py"
) else if exist "C:\Python313\python.exe" (
    set "PYTHON_CMD=C:\Python313\python.exe"
) else if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python313\python.exe" (
    set "PYTHON_CMD=%USERPROFILE%\AppData\Local\Programs\Python\Python313\python.exe"
) else (
    :: Try querying registry again after install
    for /f "usebackq tokens=2*" %%a in (`reg query "HKLM\Software\Python\PythonCore\3.13\InstallPath" /ve 2^>nul`) do (
        if exist "%%b\python.exe" set "PYTHON_CMD=%%b\python.exe"
    )
    if not defined PYTHON_CMD (
        for /f "usebackq tokens=2*" %%a in (`reg query "HKCU\Software\Python\PythonCore\3.13\InstallPath" /ve 2^>nul`) do (
            if exist "%%b\python.exe" set "PYTHON_CMD=%%b\python.exe"
        )
    )
)

if not defined PYTHON_CMD (
    echo [WARNING] Could not automatically locate the newly installed Python.
    echo Falling back to the built-in PowerShell server...
    echo.
    goto run_ps
)

:run_server

for %%i in ("!PYTHON_CMD!") do set "PYTHON_DIR=%%~dpi"
set "PYTHON_SCRIPTS=!PYTHON_DIR!Scripts"
set "PATH=!PYTHON_SCRIPTS!;!PYTHON_DIR!;!PATH!"

if exist "%~dp0requirements.txt" (
    echo [INFO] Installing required Python libraries from requirements.txt...
    "!PYTHON_CMD!" -m pip install -r "%~dp0requirements.txt"
) else if exist "%~dp0..\requirements.txt" (
    echo [INFO] Installing required Python libraries from requirements.txt...
    "!PYTHON_CMD!" -m pip install -r "%~dp0..\requirements.txt"
)

echo.
echo Starting Python local web server on port 8000...
echo Opening browser to http://localhost:8000/src/soul_matrix.html...
echo Keep this window open while using the tool. Press Ctrl+C to stop.
echo.
start "" "http://localhost:8000/src/soul_matrix.html"
"!PYTHON_CMD!" "%~dp0src\server.py"
goto end

:run_ps
echo Launching built-in PowerShell server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0src\server.ps1"
goto end

:err_not_extracted
echo.
echo ===================================================
echo   ERROR: ZIP FILE NOT EXTRACTED
echo ===================================================
echo.
echo It looks like you are running this launcher directly
echo from inside the ZIP file.
echo.
echo To run the application, you MUST extract it first:
echo.
echo   1. Close this window.
echo   2. Right-click the downloaded ZIP file.
echo   3. Select "Extract All..." and choose a folder.
echo   4. Open the extracted folder and double-click
echo      'run_locally.bat' to start the server.
echo.
echo ===================================================
echo.
pause
exit /b

:end
pause
