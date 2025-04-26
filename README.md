# ML-Demonstration-System

## Requirements
- Java Development Kit (JDK) version 17+
- Node.js
- PostgreSQL
- Docker

For MONAI Deploy: 
- NVIDIA CUDA Toolkit version 11.7+
- NVIDIA Container Toolkit 

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

# MONAI Deploy services
MONAI_PACS_URL=http://localhost:8042
MONAI_WORKFLOW_MANAGER_URL=http://localhost:5001
```
or using Spring Boot configuration file [application.yaml](https://gitlab.com/ml-demonstration-system-group/ml-demonstration-system/-/blob/main/main-service/src/main/resources/application.yaml?ref_type=heads).

2. Start MONAI Deploy Services
```bash
$ cd monai-deploy 
$ ./init.sh
$ docker compose up
```
Note: Ensure container ports are properly mapped to host ports for the Workflow Manager and Orthanc.
3. Start Spring Boot application using
```bash
$ ./gradlew :main-service:bootRun
```

4. Navigate to the frontend directory and install dependencies:
```bash
$ cd frontend
$ npm install
```
5. Run React.js application in dev-mode
```bash
$ npm run dev
``` 
6. Open your browser and go to
```
http://localhost:5173
```

#### Using Docker
1. Run application using
```bash
$ docker compose up -d --build
```

2. Start MONAI Deploy Services
```bash
$ cd monai-deploy
$ ./init.sh
$ docker compose up
```

3. Open your browser and go to
```
http://localhost:5173
```

### Set up MONAI model
The models-workflows-examples directory includes the examples of workflows configuration.

Below are the instructions for setting up a MONAI model using the `liver-tumor.json` workflow 
1. Pull the AI Liver Tumor MAP
```shell
docker pull ghcr.io/mmelqin/monai_ai_livertumor_seg_app:1.0
```

3. Log in as an administrator 
- Login: admin
- Password: password

3. Go to the administration panel and open the dialog to create a model

4. In the "Runtime" field, select the "MONAI Deploy" option. You should see a new field with the option to attach a file

5. Select the file `models-workflows-examples/liver-tumor.json`
 
6. Fill in the remaining fields and click the button to create a new model

7. Go to the organizations list and grant your organization access to the new model

8. (Optional) Test the model. Go to the model visualization page

9. Upload a DICOM dataset as a ZIP archive and click to submit

10. Wait for inference result 












## Test users
| ROLES                        | LOGIN    | PASSWORD |
|------------------------------|----------|----------|
| **ADMIN, ORGANIZATION_HEAD** | admin    | password |
| **USER**                     | user     | password |
| **USER, ORGANIZATION_HEAD**  | director | password |