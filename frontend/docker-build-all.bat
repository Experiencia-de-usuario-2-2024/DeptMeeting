@REM Microfrontends
start cmd /k "cd /d .\front-principal && docker build -t jyr20/text-edit-front-principal:v3 ."
start cmd /k "cd /d .\mf-home && docker build -t jyr20/text-edit-mf-home:v3 ."
start cmd /k "cd /d .\mf-informacion && docker build -t jyr20/text-edit-mf-informacion:v3 ."
start cmd /k "cd /d .\mf-kanbanplus && docker build -t jyr20/text-edit-mf-kanbanplus:v3 ."
start cmd /k "cd /d .\mf-login && docker build -t jyr20/text-edit-mf-login:v3 ."
start cmd /k "cd /d .\mf-perfil && docker build -t jyr20/text-edit-mf-perfil:v3 ."
start cmd /k "cd /d .\mf-proyectos && docker build -t jyr20/text-edit-mf-proyectos:v3 ."
start cmd /k "cd /d .\mf-tareas && docker build -t jyr20/text-edit-mf-tareas:v3 ."
