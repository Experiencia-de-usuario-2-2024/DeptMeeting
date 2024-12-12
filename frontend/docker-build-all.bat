@REM Microfrontends
start cmd /k "cd /d .\front-principal && docker build --no-cache -t jyr20/deptmeeting-frontend-principal ."
start cmd /k "cd /d .\mf-home && docker build --no-cache -t jyr20/deptmeeting-mf-home ."
start cmd /k "cd /d .\mf-informacion && docker build --no-cache -t jyr20/deptmeeting-mf-informacion ."
start cmd /k "cd /d .\mf-kanbanplus && docker build --no-cache -t jyr20/deptmeeting-mf-kanbanplus ."
start cmd /k "cd /d .\mf-login && docker build --no-cache -t jyr20/deptmeeting-mf-login ."
start cmd /k "cd /d .\mf-perfil && docker build --no-cache -t jyr20/deptmeeting-mf-perfil ."
start cmd /k "cd /d .\mf-proyectos && docker build --no-cache -t jyr20/deptmeeting-mf-proyectos ."
start cmd /k "cd /d .\mf-tareas && docker build --no-cache -t jyr20/deptmeeting-mf-tareas ."
start cmd /k "cd /d .\mf-desarrolloreunion && docker build --no-cache -t jyr20/deptmeeting-mf-desarrolloreunion ."