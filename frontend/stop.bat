@echo off
REM Lista de puertos a cerrar
set PORTS=3003 3025 3021 3023 3022

REM Iterar sobre cada puerto y cerrar el proceso que lo está utilizando
for %%P in (%PORTS%) do (
    echo Cerrando procesos en el puerto %%P...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%P') do (
        taskkill /PID %%a /F
    )
)

echo Todos los procesos en los puertos especificados han sido cerrados.
pause