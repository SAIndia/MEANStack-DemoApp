# MEANStack-DemoApp

We have created an online portal for sports enthusiasts to bet on their favourite games and tournaments. The portal is developed in MEAN stack (MongoDB, Express, Angular and Node.js). The administrator shall set up the games in the back end and the registered users can save their bets on the outcomes of the games.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on your system

### Prerequisites

Have these packages installed and running on your system. 

Node.js, and npm
Angular2 
Angular CLI
Nodemon
MongoDB
Passport 


### Installing

A step by step series of examples that tell you have to get a development environment running


#### Admin Side Setup

Open the folder “gamers_tasklist” and run the command line

Enter npm install (this installs all the node modules)
Enter npm install –g - -save nodemon (this installs nodemon, which will start the server)

Select the sub folder “client” inside the folder “gamers_tasklist” in the command line
Enter npm install 
Enter npm start


Re-Open the folder “gamers_tasklist” in the command line
Enter nodemon



Currently we have created database in mLab cloud. If you want the database to be in local MongoDB instance, can do the same. 

Open the browser, enter http://localhost:3000
Username: webqatesting@gmail.com
Password: admin@123



#### Client Side Setup

Gamebet client side is done using Angular CLI

Open the folder “gamebet-frontend” and run the command line

Enter npm install (this installs all the node modules)
Enter npm install –g @angular/cli
Enter node server.js (Warning: You may see package missing messages)
Fix each of the package missing instances by installing the same 
Eg: if the cookie parser package is not found please enter the following command
npm install - -save cookie-parser
Similarly install other missing packages 

Enter ng server (for compiling the files)
Enter ng build (for publishing the files)

After executing the above commands successfully, a folder named “dist” gets automatically created in the “gamebet-frontend” folder

Copy the contents in the folder “images_css” into the “dist” folder.

Open the browser, enter http://localhost:4200
User Registration: Login --> Signup
Sample User Credentials - client@gamebet.co.in , client@123

### Notes

We have also included provision for Facebook and Google authentication. It will not work as such; you may need to follow certain steps. Please map your IP and host name into C:\Windows\System32\drivers\etc\hosts. 
Eg:  192.168.0.179 sagamebet.com


### Versioning

Version 1.0.0
