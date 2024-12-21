networks:
  deptmeeting-network:

services:
  rabbitmq:
    image: rabbitmq:4-management
    container_name: rabbitmq-container
    environment:
      - RABBITMQ_DEFAULT_USER=user
      - RABBITMQ_DEFAULT_PASS=password
    ports:
      - 5672:5672
      - 15672:15672
    networks:
      - deptmeeting-network

  mongodb:
    image: mongo:latest
    container_name: mongodb-container
    ports:
      - 27017:27017
    volumes:
      - mongodb_data:/data/db
    networks:
      - deptmeeting-network

  ms-users:
    container_name: deptmeeting-ms-users
    image: jyr20/ms-users:latest
    environment:
      - JWT_SECRET=clavesecreta2312
      - EXPIRES_IN=12h
      - AMQP_URL=amqp://user:password@rabbitmq:5672
      - URI_MONGODB_USERS=mongodb://mongodb:27017/deptmeeting_users
    depends_on:
      - rabbitmq
    networks:
      - deptmeeting-network

  api-gateway:
    image: jyr20/api-gateway:latest
    ports:
      - 3002:3002
      - 84:84
    environment:
      - APP_URL=https://jyrproject.com
      - API_PORT=3002
      - PORT=3002
      - JWT_SECRET=clavesecreta2312
      - EXPIRES_IN=12h
      - AMQP_URL=amqp://user:password@rabbitmq:5672
    networks:
      - deptmeeting-network
    depends_on:
      - rabbitmq

  ms-projects:
    container_name: deptmeeting-ms-projects
    image: jyr20/ms-projects:latest
    environment:
      - JWT_SECRET=clavesecreta2312
      - EXPIRES_IN=12h
      - AMQP_URL=amqp://user:password@rabbitmq:5672
      - URI_MONGODB_PROJECTS=mongodb://mongodb:27017/deptmeeting_projects
    depends_on:
      - rabbitmq
    networks:
      - deptmeeting-network

  ms-meetings:
    container_name: deptmeeting-ms-meetings
    image: jyr20/ms-meetings:latest
    environment:
      - JWT_SECRET=clavesecreta2312
      - EXPIRES_IN=12h
      - AMQP_URL=amqp://user:password@rabbitmq:5672
      - URI_MONGODB_MEETINGS=mongodb://mongodb:27017/deptmeeting_meetings
    depends_on:
      - rabbitmq
    networks:
      - deptmeeting-network

  ms-notifications:
    container_name: deptmeeting-ms-notifications
    image: jyr20/ms-notifications:latest
    environment:
      - JWT_SECRET=clavesecreta2312
      - EXPIRES_IN=12h
      - AMQP_URL=amqp://user:password@rabbitmq:5672
      - URI_MONGODB=mongodb://mongodb:27017/deptmeeting_notifications
      - IO_PORT=84
      - EMAIL_USER=jairosantiespino@gmail.com
      - EMAIL_PASS="farp asej fhsw dwni"
      - EMAIL_SERVICE=gmail
      - EMAIL_HOST=smtp.gmail.com
      - EMAIL_PORT=8000
    depends_on:
      - rabbitmq
    networks:
      - deptmeeting-network


  ms-elements:
    container_name: deptmeeting-ms-elements
    image: jyr20/ms-elements:latest
    environment:
      - JWT_SECRET=clavesecreta2312
      - EXPIRES_IN=12h
      - AMQP_URL=amqp://user:password@rabbitmq:5672
      - URI_MONGODB_ELEMENTS=mongodb://mongodb:27017/deptmeeting_elements
    depends_on:
      - rabbitmq
    networks:
      - deptmeeting-network

  ms-meetingminutes:
    container_name: deptmeeting-ms-meetingminutes
    image: jyr20/ms-meetingminutes:latest
    environment:
      - JWT_SECRET=clavesecreta2312
      - EXPIRES_IN=12h
      - AMQP_URL=amqp://user:password@rabbitmq:5672
      - URI_MONGODB_MEETINGMINUTES=mongodb://mongodb:27017/deptmeeting_meetingminutes
    depends_on:
      - rabbitmq
    networks:
      - deptmeeting-network

  front-principal:
    image: jyr20/front-principal:latest
    container_name: deptmeeting-front-principal
    ports:
      - 3003:3003
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_MF_URL=https://jyrproject.com
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_PRINCIPAL_PORT=3003
      - REACT_APP_MF_HOME=/mf_home
      - REACT_APP_MF_LOGIN=/mf_login
      - REACT_APP_MF_PROYECTOS=/mf_proyectos
      - REACT_APP_MF_PERFIL=/mf_perfil
      - REACT_APP_MF_DESARROLLOREUNION=/mf_desarrolloreunion
      - REACT_APP_MF_INFORMACION=/mf_informacion
      - REACT_APP_MF_TAREAS=/mf_tareas
      - REACT_APP_MF_KANBANPLUS=/mf_kanbanplus
      - REACT_APP_BACKEND_URL=https://jyrproject.com/gateway

  mf-home:
    image: jyr20/mf-home:latest
    container_name: deptmeeting-mf-home
    ports:
      - 3020:3020
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_HOME_PORT=3020
      - REACT_APP_BACKEND_URL=https://jyrproject.com/gateway

  mf-informacion:
    image: jyr20/mf-informacion:latest
    container_name: deptmeeting-mf-informacion
    ports:
      - 3025:3025
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_INFORMACION_PORT=3025

  mf-login:
    image: jyr20/mf-login:latest
    container_name: deptmeeting-mf-login
    ports:
      - 3021:3021
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_LOGIN_PORT=3021
      - REACT_APP_BACKEND_URL=https://jyrproject.com/gateway
      - REACT_APP_GOOGLE_CLIENT_ID=463721565707-n85gsgtqtggm16pp87884uslc0p56t6d.apps.googleusercontent.com

  mf-perfil:
    image: jyr20/mf-perfil:latest
    container_name: deptmeeting-mf-perfil
    ports:
      - 3023:3023
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_PERFIL_PORT=3023
      - REACT_APP_BACKEND_URL=https://jyrproject.com/gateway

  mf-proyectos:
    image: jyr20/mf-proyectos:latest
    container_name: deptmeeting-mf-proyectos
    ports:
      - 3022:3022
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_PROYECTOS_PORT=3022
      - REACT_APP_BACKEND_URL=https://jyrproject.com/gateway

  mf-desarrolloreunion:
    image: jyr20/mf-desarrolloreunion:latest
    container_name: deptmeeting-mf-desarrolloreunion
    ports:
      - 3024:3024
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_DESARROLLOREUNION_PORT=3024
      - REACT_APP_BACKEND_URL=https://jyrproject.com
      - REACT_APP_BACKEND_GATEWAY=/gateway
      - REACT_APP_BACKEND_IO=/socket.io

  mf-kanbanplus:
    image: jyr20/mf-kanbanplus:latest
    container_name: deptmeeting-mf-kanbanplus
    ports:
      - 3027:3027
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_KANBANPLUS_PORT=3027
      - REACT_APP_BACKEND_URL=https://jyrproject.com/gateway

  mf-tareas:
    image: jyr20/mf-tareas:latest
    container_name: deptmeeting-mf-tareas
    ports:
      - 3026:3026
    restart: always
    depends_on:
      - api-gateway
    networks:
      - deptmeeting-network
    environment:
      - REACT_APP_ALLOWED_HOSTS=jyrproject.com
      - REACT_APP_MF_TAREAS_PORT=3026
      - REACT_APP_BACKEND_URL=https://jyrproject.com/gateway

volumes:
  mongodb_data:
    driver: local
