@REM Microfrontends
start cmd /k "cd /d .\front-principal && docker build -t jyr20/deptmeeting-frontend-principal ."
start cmd /k "cd /d .\mf-home && docker build -t jyr20/deptmeeting-mf-home ."
start cmd /k "cd /d .\mf-informacion && docker build -t jyr20/deptmeeting-mf-informacion ."
start cmd /k "cd /d .\mf-kanbanplus && docker build -t jyr20/deptmeeting-mf-kanbanplus ."
start cmd /k "cd /d .\mf-login && docker build --no-cache -t jyr20/deptmeeting-mf-login ."
start cmd /k "cd /d .\mf-perfil && docker build -t jyr20/deptmeeting-mf-perfil ."
start cmd /k "cd /d .\mf-proyectos && docker build -t jyr20/deptmeeting-mf-proyectos ."
start cmd /k "cd /d .\mf-tareas && docker build -t jyr20/deptmeeting-mf-tareas ."
