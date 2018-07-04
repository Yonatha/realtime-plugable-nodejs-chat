# Real Time "plugable" Nodejs multi chat room


Simple, real-time and "plugable" multi chat room with Nodejs, Socket.io and MongoDB.
site, portal, etc..

## Screanshots

Client HTML

![alt Client](https://github.com/Yonatha/realtime-plugable-nodejs-chat/blob/master/screanshot01.png)

Server HTML

![alt Server](https://github.com/Yonatha/realtime-plugable-nodejs-chat/blob/master/screanshot02.png)

# The chat consists:  

## Service script 
Provide the service to enable client and server version connections

## Server HTML version 
A simple interface for accessing communications initiated by users of the client version. I initially decided to take this approach because I another system made in Ruby On Rails in which I wanted to take advantage of the entire authentication system, so that this version was only incorporated to this manager.

## Client HTML Version 
Interface that is inserted in websites, portals or communication areas where you want to offer a real-time service.

## Starting the service 
Assuming you already have nodejs installed, we will ensure that MongoDB is also available on your computer / host for this. I use an image in MongoDB Docker and create a container with:

```console
$ docker run --name chat_mongo -p 27017:27017 -d mongo
```

Note: If you do not want to use docker, you can install MongoDB normally.

Realize the clone of this repository

```console
$ git clone https://github.com/Yonatha/realtime-plugable-nodejs-chat.git
$ cd realtime-plugable-nodejs-chat
$ npm install
$ node app.js 
```

if you cant restart automaticaly app.js use the command (helpful to development environment) ```
```console
$ nodemon app.js
```

Open the server.html versions to get access to the chat service manager and open the client.html version, sample layout to be
inserted in the area of ​​your site.

Enjoy
