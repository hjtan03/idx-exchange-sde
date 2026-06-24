# IDX Exchange Property Search Application

## Overview

This project is part of the IDX Exchange Software Development Internship.

The goal is to build a Zillow-style property search application using real MLS property data. The application will provide property search, filtering, property detail pages, maps, photos, and open house information.

## Technology Stack

* Frontend: React
* Backend: Node.js + Express
* Database: MySQL 8
* Containerization: Docker
* Version Control: Git + GitHub

## Current Progress

### Week 1 Completed

* Docker Desktop installed and configured
* MySQL 8 container running locally
* `rets` database created
* `rets_property` table imported
* `rets_openhouse` table imported
* Database connectivity verified

### Dataset Statistics

| Table          | Rows   |
| -------------- | ------ |
| rets_property  | 53,122 |
| rets_openhouse | 4,282  |

## Project Structure

backend/ - Express API

frontend/ - React application

docs/ - Project documentation and notes

## Running the Database

Start the container:

docker start idx-mysql-local

Connect to MySQL:

docker exec -it idx-mysql-local mysql -u root -p

Select database:

USE rets;

## Future Features

* REST API
* Property search
* Property filters
* Property detail page
* Open house integration
* Interactive maps
* Testing and coverage

## Author

Hong-Ming Justin Tan
IDX Exchange SDE Intern
