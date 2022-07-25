# Kanban Board
A Kanban board web application with a drag-and-drop functionality, and a real-time database integration with MongoDB.
![image](https://user-images.githubusercontent.com/53790060/180802635-e5de6bca-9628-4682-bfc5-102574a4d223.png)

## Technologies
* React
* MongoDB/Mongoose
* Express
* Material UI
* CKEditor 5
* Axios
* JWT
* Node.js

## Features
* Allows users to register and login using JWT token
* Users can create a section where tasks can be added using CKEditor as the text editor
* Tasks can be added, edited, favourited and deleted using a REST API built with Express and Axios
* User accounts and tasks are stored within a MongoDB database
* Both backend and frontend are hosted on Heroku

## Build/Deploy
To run the app locally, clone the repo and install the app using: 
```
  > git clone https://github.com/DeviousLab/mern-kanban-board.git
  > cd mern-kanban-board
  > npm i
```
To run the client only
```
  > npm run client
```
To run the backend only
```
  > npm run server
```
To run both at the same time
```
  > npm run dev
```
