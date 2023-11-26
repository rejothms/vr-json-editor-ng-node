# vr-json-editor-ng-node
## Node Min Version : node:18.13.0

This project consists of a Node.js server and an Angular frontend, both containerized using Docker. The Node.js server runs on port 3003, and the Angular app runs on port 4200.

## With Docker 
## Prerequisites

Make sure you have Docker and Docker Compose installed on your machine.

- Docker: [Get Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository:

    ```bash
    git clone (https://github.com/rejothms/vr-json-editor-ng-node.git)
    cd repostiory contained docker compose file.
    ```

2. Run the following command to start the services:

    ```bash
    docker-compose up 
    ```

   This command will build the Docker images and start the containers for both the Node.js server and the Angular app.

3. Access the applications:

   - Node.js server: [http://localhost:3003](http://localhost:3003)
   - Angular app: [http://localhost:4200](http://localhost:4200)

4. To stop the services, use:

    ```bash
    docker-compose down
    ```

## Without docker
 Prerequisites
vrjsoneditor - Angular front end. 
vrserver      node server

git clone  git clone (https://github.com/rejothms/vr-json-editor-ng-node.git)
#Install Node.js server dependencies
-cd vrserver
```npm install```

-Install Angular app dependencies
-cd vrjsoneditor
```npm install```

-Inside the vrserver directory
```npm start```

-Inside the vrjsoneditor directory
```ng serve ```


## Application Workflow:

Upon the initial launch, the application redirect the user to the login screen. Here, users can input their username to access the dashboard.

The application using Socket.IO for real-time communication between the client and server. The connection is established upon the application's loading, and user-specific connections are enabled upon successful login to the dashboard.

In the dashboard, the user is presented with a listing of JSON files retrieved from the server through a dedicated API endpoint. The server maintains a 'json' folder containing static JSON files.

Upon selecting a JSON file, its content is dynamically loaded into a JSON editor( another API created ) on the right side of the dashboard. Users can then edit the JSON content in real-time. These changes are instantly send to other users who have the same JSON file open. It's important to note that edited JSON files must remain valid for seamless sharing among users.

The application ensures that user details are not stored in any database.
Additionally, users have the ability to download the edited JSON file. The application provides information about the last user who updated the file.

