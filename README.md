# ML-Demonstration-System

## Requirements
- Java Development Kit (JDK) version 17 or higher
- Node.js
- PostgreSQL
- Docker

## Getting Started
### Running the application

#### Using Gradle
1. Set up environment variables according to the example in the file [.env.template](.env.template). 
```bash
# PostgreSQL variables
DB_NAME=db                
DB_HOST=localhost        
DB_PORT=5432             
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=example-of-secret-not-for-production-use

# Google SMTP server
SMTP_USERNAME=ml.demonstation.app@gmail.com
SMTP_PASSWORD=password
```
or using Spring Boot configuration file [application.yaml](main-service/src/main/resources/application.yaml).
2. Start Spring Boot application using
```bash
$ ./gradlew :main-service:bootRun
```
3. Navigate to the frontend directory and install dependencies:
```bash
$ cd frontend
$ npm install
```
4. Run React.js application in dev-mode
```bash
$ npm run dev
``` 
5. Open your browser and go to
```
http://localhost:5173
```

#### Using Docker
1. Build JAR-file
```bash
$ ./gradlew :main-service:bootJar
```
2. Run Spring Boot application using
```bash
$ docker compose up -d --build
```
3. Navigate to the frontend directory and install dependencies:
```bash
$ cd frontend
$ npm install
```
4. Run React.js application in dev-mode
```bash
$ npm run dev
```
5. Open your browser and go to
```
http://localhost:5173
```

## Test users
| ROLES                        | LOGIN    | PASSWORD |
|------------------------------|----------|----------|
| **ADMIN, ORGANIZATION_HEAD** | admin    | password |
| **USER**                     | user     | password |
| **USER, ORGANIZATION_HEAD**  | director | password |