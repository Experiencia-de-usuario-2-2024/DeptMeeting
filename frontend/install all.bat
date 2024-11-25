@echo off
REM Definir variables para las rutas comunes
set BASE_PATH=%CD%

REM Array de directorios de microfrontends
set MF_DIRS=front-principal mf-home mf-informacion mf-login mf-perfil mf-kanbanplus mf-tareas

REM Iniciar Windows Terminal y abrir la primera pestaña con el primer microfrontend
wt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\front-principal && npm install && npm run start"

REM Agregar pestañas para los demás microfrontends
for %%i in (mf-home mf-informacion mf-login mf-perfil mf-proyectos mf-Textedit) do (
    wt -w 0 nt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\%%i && npm install && npm run start"
)

echo Todos los microfrontends han sido iniciados.
pause
