# Getting Started

## Requirements
Before proceeding, ensure you have the following installed on your system:
- Node.js
- npm

## Installation
Navigate to the project directory and run the following command to install the project's dependencies

    npm install

## Database Configuration
Open the schema.prisma file and replace the "url" in datasource db with your actual database connection string. This connection string should point to your PostgreSQL database instance.

## Database Creation (if required)
If the leo_db database does not exist, create it manually using the following command:

    psql -h <host> -p <port> -U <username>
    CREATE DATABASE leo_db;

## Starting the App
Once the database is configured and created, start the app by running the following command:

    npm start

This will start the development server and run the app on port 3000. You can then access the app in your web browser by going to http://localhost:3000.

## Running Tests
To run the application's tests, use the following command:

    npm test

## Note
I have written the test cases in a single file as schedule and task table are associated with each other. It can be split into 2 different files in the future for maintaing the testcases properly.
