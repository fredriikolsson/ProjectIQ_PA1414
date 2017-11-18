# Welcome to ProjectIQ
By Fredrik Olsson

## Preparations

Start by downloading and installing NodeJS
[NodeJS webpage](https://nodejs.org/en/ "NodeJS Hompeage")

When NodeJS is finnished and propperly installed 
Continue to install the MySQL-client

In Debian-based Linux Distros
```bash
   $ sudo apt-get update
   $ sudo apt-get install mysql-server
   $ mysql_secure_installation
```

For other operating systems [Click Here to get to the offical MySQL website to download](https://dev.mysql.com/downloads/mysql/ "MySQL Download Page")

## Installation

* When both NodeJS and MySQL are installed correctly, either download or pull this code down to your computer. 
Extract ZIP if needed
* Go to the folder of the project and open a terminal
* If on Linux or MacOS or a bash-terminal in Windows type `./initialize.sh` to get all prerequisites packages for Node and to get the DB up

* If not, then open the file and follow the instructions there

* Now open the project in your favorite text-editor
* Go to the file `dbPassword.js` and change the code as the comment suggests
* Return to the terminal
* On MacOS or Linux, run the app with this command:

```bash
$ DEBUG=myapp:* npm start
```
On Windows, use this command:
```cmd
> set DEBUG=myapp:* & npm start
```
Then load http://localhost:3000/ in your browser to access the app.

### If above is note working please contact me at `fredde665@gmail.com`