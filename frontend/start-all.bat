@echo off
REM Definir variables para las rutas comunes
set BASE_PATH=D:\UX\DeptMeeting\frontend

REM Array de directorios de microfrontends
set MF_DIRS=front-principal mf-desarrolloreunion mf-home mf-informacion mf-login mf-perfil mf-proyectos

REM Iniciar Windows Terminal y abrir la primera pestaña con el primer microfrontend
wt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\front-principal && bun start"

REM Agregar pestañas para los demás microfrontends
for %%i in (mf-desarrolloreunion mf-home mf-informacion mf-login mf-perfil mf-proyectos) do (
    wt -w 0 nt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\%%i && bun start"
)

echo Todos los microfrontends han sido iniciados.
pause