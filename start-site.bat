@echo off
setlocal

set "ROOT=%~dp0"
set "SITE_DIR=%ROOT%html"
set "HOST=127.0.0.1"
set "PORT=8000"
set "URL=http://%HOST%:%PORT%"
set "PHP_EXE="

if not exist "%SITE_DIR%\index.php" (
    echo [ERROR] %SITE_DIR%\index.php not found.
    echo Check that project folder contains "html\index.php".
    pause
    exit /b 1
)

for /f "delims=" %%P in ('where php 2^>nul') do if not defined PHP_EXE set "PHP_EXE=%%P"
if not defined PHP_EXE call :find_local_php

if not defined PHP_EXE (
    where winget >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] PHP is not installed and winget is unavailable.
        echo Install PHP manually, then run this file again.
        pause
        exit /b 1
    )

    echo PHP not found. Installing PHP 8.4 via winget...
    winget install --id PHP.PHP.8.4 -e --source winget --accept-package-agreements --accept-source-agreements
    if errorlevel 1 (
        echo [ERROR] Automatic PHP install failed.
        echo Run manually: winget install --id PHP.PHP.8.4 -e --source winget --accept-package-agreements --accept-source-agreements
        pause
        exit /b 1
    )

    for /f "delims=" %%P in ('where php 2^>nul') do if not defined PHP_EXE set "PHP_EXE=%%P"
    if not defined PHP_EXE call :find_local_php
)

if not defined PHP_EXE (
    echo [ERROR] PHP was installed but executable was not found.
    echo Close and reopen terminal/session, then run this file again.
    pause
    exit /b 1
)

echo Starting site from "%SITE_DIR%"
echo URL: %URL%
echo PHP: %PHP_EXE%
echo Press Ctrl+C in this window to stop the server.
echo.

start "" "%URL%"
"%PHP_EXE%" -S %HOST%:%PORT% -t "%SITE_DIR%"

endlocal
exit /b 0

:find_local_php
for %%F in (
    "%LOCALAPPDATA%\Microsoft\WinGet\Links\php.exe"
    "C:\xampp\php\php.exe"
    "%USERPROFILE%\scoop\apps\php\current\php.exe"
    "C:\Program Files\PHP\php.exe"
    "C:\Program Files\PHP\*\php.exe"
    "C:\OSPanel\modules\php\*\php.exe"
    "C:\OpenServer\modules\php\*\php.exe"
) do (
    if exist "%%~fF" (
        set "PHP_EXE=%%~fF"
        goto :eof
    )
)
goto :eof
