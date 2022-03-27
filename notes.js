/* 

* api: 

> touch Dockerfile
   #FROM node:NODE_VERSION
   #
   #CMD ["/bin/bash"]
> docker build -t myfirstcontainer
> docker run -it myfirstcontainer
   .your are inside the container

> docker ps //show containers

> docker run -it -p 3000:3000 myfirstcontainer //run in specific port 

* docker compose : 

> create docker-compose.yml
> docker compose build
> docker compose up // bring up all the services 
> docker compose up -d // run in the background
>  
> 





> connect to postgres // sudo -i -u postgres











*/
