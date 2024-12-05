@REM Microfrontends
start cmd /k "cd /d .\front-principal && docker build -t pipetboy/text-edit-front-principal:v3 ."
start cmd /k "cd /d .\mf-home && docker build -t pipetboy/text-edit-mf-home:v3 ."
start cmd /k "cd /d .\mf-informacion && docker build -t pipetboy/text-edit-mf-informacion:v3 ."
start cmd /k "cd /d .\mf-kanbanplus && docker build -t pipetboy/text-edit-mf-kanbanplus:v3 ."
start cmd /k "cd /d .\mf-login && docker build -t pipetboy/text-edit-mf-login:v3 ."
start cmd /k "cd /d .\mf-perfil && docker build -t pipetboy/text-edit-mf-perfil:v3 ."
start cmd /k "cd /d .\mf-proyectos && docker build -t pipetboy/text-edit-mf-proyectos:v3 ."
start cmd /k "cd /d .\mf-tareas && docker build -t pipetboy/text-edit-mf-tareas:v3 ."
