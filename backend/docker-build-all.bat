
@REM Microservicios
start cmd /k "cd /d .\api-gateway && docker build -t pipetboy/text-edit-ms-api-gateway ."
start cmd /k "cd /d .\ms-elements && docker build -t pipetboy/text-edit-ms-elements ."
start cmd /k "cd /d .\ms-meetingminutes && docker build -t pipetboy/text-edit-ms-meetingminutes ."
start cmd /k "cd /d .\ms-meetings && docker build -t pipetboy/text-edit-ms-meetings ."
start cmd /k "cd /d .\ms-notifications && docker build -t pipetboy/text-edit-ms-notifications ."
start cmd /k "cd /d .\ms-projects && docker build -t pipetboy/text-edit-ms-projects ."
start cmd /k "cd /d .\ms-users && docker build -t pipetboy/text-edit-ms-users ."
