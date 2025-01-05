@echo off
REM Definir variables para las rutas comunes
set BASE_PATH=D:\UX\DeptMeeting\backend

REM Array de directorios de microfrontends
set MF_DIRS=api-gateway ms-elements ms-meetingminutes ms-meetings ms-projects ms-users

REM Iniciar Windows Terminal y abrir la primera pestaña con el primer microfrontend
wt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\front-principal && bun start"

REM Agregar pestañas para los demás microfrontends
for %%i in (api-gateway ms-elements ms-meetingminutes ms-meetings ms-projects ms-users) do (
    wt -w 0 nt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\%%i && bun start"
)

echo Todos los microservicios han sido iniciados.
pause