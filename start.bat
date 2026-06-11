@echo off
title Eternis City - QLCC

cd /d "%~dp0"

echo ============================================
echo   Eternis City - Quan Ly Chung Cu
echo ============================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Can cai dat Node.js: https://nodejs.org
    pause
    exit /b
)

:: Check MySQL
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Can cai dat MySQL.
    pause
    exit /b
)

:: Install backend dependencies
echo [1/4] Dang cai dat backend...
if not exist "backend\node_modules" (
    cd backend && npm install && cd ..
) else (
    echo   - Backend da san sang
)

:: Install frontend dependencies
echo [2/4] Dang cai dat frontend...
if not exist "frontend\node_modules" (
    cd frontend && npm install && cd ..
) else (
    echo   - Frontend da san sang
)

:: Setup .env file if not exists
if not exist "backend\.env" (
    echo [*] Tao file .env tu .env.example...
    copy "backend\.env.example" "backend\.env" >nul
    echo   - Da tao backend\.env, vui long cap nhat JWT_SECRET neu can
)

:: Get MySQL password
if "%MYSQL_PASSWORD%"=="" set MYSQL_PASSWORD=root

:: Import database
echo [3/4] Dang import database...

mysql --default-character-set=utf8mb4 -u root -p%MYSQL_PASSWORD% < "database\schema.sql" 2>nul
if %errorlevel% equ 0 (
    echo   - Schema: OK
) else (
    echo   - Schema: co the da ton tai hoac sai mat khau MySQL
)

mysql --default-character-set=utf8mb4 -u root -p%MYSQL_PASSWORD% < "database\seed.sql" 2>nul
if %errorlevel% equ 0 (
    echo   - Du lieu mau: OK
) else (
    echo   - Du lieu mau: co the da ton tai hoac sai mat khau MySQL
)

echo.
:: Start backend
echo [4/4] Dang khoi dong Backend (port 3000)...
start "Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend
echo [4/4] Dang khoi dong Frontend (port 5173)...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:5173
echo ============================================
echo.
echo  Tai khoan mac dinh:
echo    Admin - user: admin / pass: 123456
echo    User  - user: user1 / pass: 123456
echo.
echo  Luu y: Neu can, dat lai JWT_SECRET trong backend\.env
echo  Neu MySQL khac password, dat truoc bien: set MYSQL_PASSWORD=...
echo.
echo  Dong cua so nay de tat tat ca.
echo.
pause
