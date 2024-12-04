@echo off
REM Definir variables para las rutas comunes

REM Imprimir el valor de BASE_PATH en la consola
echo El valor de BASE_PATH es: %BASE_PATH%

REM Array de directorios de microfrontends
set MF_DIRS=front-principal mf-home mf-informacion mf-login mf-perfil mf-kanbanplus mf-tareas

REM Iniciar Windows Terminal y abrir la primera pestaña con el primer microfrontend
wt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\front-principal && npm run start"

REM Agregar pestañas para los demás microfrontends
for %%i in (mf-home mf-informacion mf-login mf-perfil mf-proyectos mf-textedit) do (
    wt -w 0 nt -p "Command Prompt" cmd /k "cd /d %BASE_PATH%\%%i && npm run start"
)

echo Todos los microfrontends han sido iniciados.
pause