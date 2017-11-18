#!/bin/bash

npm install; 

echo -n "Enter the name of the root MYSQL account: "

read root

mysql -u "$root" -p < piq.sql; 

echo "Done! Start server by typing 'node .bin/www'" 


#---------------------------------------------------------------
# Not using bash? In the terminal where you are executing all the NodeJS
# Related information type 'npm install'
# 
# Where you are handling your MySQL-script
# Import the file piq.sql there to the database piq (if not created create)
#
# If that is not working, I highly recommend switching to bash
#
#---------------------------------------------------------------