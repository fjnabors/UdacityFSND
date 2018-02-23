README file for running newsanalysis.py

This program runs an analysis on the news database to answer three questions
with queries

Provided Virtual Machine for this project runs with vagrant, this Installation
guide can be found here:
	https://classroom.udacity.com/nanodegrees/nd004/parts/8d3e23e1-9ab6-47eb-b4f3-d5dc7ef27bf0/modules/bc51d967-cb21-46f4-90ea-caf73439dc59/lessons/5475ecd6-cfdb-4418-85a2-f2583074c08d/concepts/14c72fe3-e3fe-4959-9c4b-467cf5b7c3a0

Requirements for Running:
	*Installation of postgresql on your Ubuntu machine or provided VM
		command: sudo apt-get install postgresql
	*Installation of python3.6 on your machine or provided VM
		command: sudo apt-get install python3 python3-pip
	*Required packages:
		command: sudo -H pip3 install flask packaging oauth2client redis passlib
						 flask-httpauth
		command: sudo -H pip3 install sqlalchemy flask-sqlalchemy psycopg2
						 bleach requests
	*Database data (newsdata.sql)
		download: https://d17h27t6h515a5.cloudfront.net/topher/2016/August/57b5f748_newsdata/newsdata.zip
	*To load the data, cd into the vagrant directory and use the command:
	 		psql -d news -f newsdata.sql.

			psql — the PostgreSQL command line program
			-d news — connect to the database named news which has been set up for you
			-f newsdata.sql — run the SQL statements in the file newsdata.sql


- Run newsanalysis.py in terminal with command:
	python3 newsanalysis.py

	* python 3.6 must be install in your machine to run this command
  * pandas must also be installed for this program to run:
					sudo apt-get install python3-pandas
