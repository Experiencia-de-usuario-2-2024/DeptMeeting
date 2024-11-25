@echo off
REM Definir variables para las rutas comunes
set BASE_PATH=C:\Users\Pipet\Documents\Github\MemFollow-TextEdit-Backend\MicroServicios

REM Array de directorios de microservicios
set MS_DIRS=api-gateway ms-elements ms-meetingminutes ms-meetings ms-notifications ms-projects ms-users

REM Iniciar Windows Terminal y abrir la primera pestaña con el primer microservicio
wt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\api-gateway && npm run start"

REM Agregar pestañas para los demás microservicios
for %%i in (ms-elements ms-meetingminutes ms-meetings ms-notifications ms-projects ms-users) do (
    timeout /t 2 /nobreak >nul
    wt -w 0 nt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\%%i && npm run start"
)

echo Todos los microservicios han sido iniciados.
pause