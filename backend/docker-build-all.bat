
@REM Microservicios
start cmd /k "cd /d .\api-gateway && docker build --no-cache -t jyr20/deptmeeting-api-gateway ."
start cmd /k "cd /d .\ms-elements && docker build -t jyr20/deptmeeting-ms-elements ."
start cmd /k "cd /d .\ms-meetingminutes && docker build -t jyr20/deptmeeting-ms-meetingminutes ."
start cmd /k "cd /d .\ms-meetings && docker build -t jyr20/deptmeeting-ms-meetings ."
start cmd /k "cd /d .\ms-notifications && docker build -t jyr20/deptmeeting-ms-notifications ."
start cmd /k "cd /d .\ms-projects && docker build -t jyr20/deptmeeting-ms-projects ."
start cmd /k "cd /d .\ms-users && docker build -t jyr20/deptmeeting-ms-users ."
