# ML-Demonstration-System
### [Original repository on GitLab](https://gitlab.com/USERNAME/PROJECT)

# Presentation

Project overview and implementation details:

- [View presentation (PDF)](https://drive.google.com/file/d/1j6Adamp5D8jgwf06fPWKAkzr4uSdLA9v/view?usp=sharing)

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

Below are the instructions for setting up a MONAI model using the `breast-classification.json` workflow.


Sample DICOM files for testing can be found at the following link: https://drive.google.com/drive/folders/1Dryozl2MwNunpsGaFPVoaKBLkNbVM3Hu

1. Pull the MONAI AI Breast Density Classification MAP
```shell
$ docker pull ghcr.io/mmelqin/monai_ai_breast_density_cls_app:1.0
```

2. Log in as an administrator 
- Login: admin
- Password: password

3. Go to the administration panel and open the dialog to create a model

4. In the "Runtime" field, select the "MONAI Deploy" option. You should see a new field with the option to attach a file

5. Select the file `models-workflows-examples/breast-classification.json`
 
6. Fill in the remaining fields and click the button to create a new model

7. Go to the organizations list and grant your organization access to the new model

8. (Optional) Test the model. Go to the model visualization page

9. Upload a DICOM and click to submit. 

10. Wait for inference result

### Working with Triton Inference Models

Для запуска и работы с моделями машинного обучения через **Triton Inference Server**, выполните следующие шаги:

#### 1. Running the model loading script

Before launching the main application, you need to prepare the models to work with **Triton Inference Server**.

1. Go to the `models` directory and run the script `run.sh `, which exports models in ONNX format and creates the corresponding model repository structure:

```bash
$ cd models
$ chmod +x run.sh  # если скрипт не исполняемый
$ ./run.sh
```

This script:
- Exports TinyConv, U-Net and Wav2Vec2 models in ONNX format.
- Creates the necessary folder structure and configuration files (`config.pbtxt`) for each model.
- Prepares Triton for their inference.

#### 2. Launching the main container with Triton Inference Server

Go back to the root directory of the project and run the main `docker-compose` to launch the Triton Inference Server:

```bash
$ cd ..
$ docker compose up -d --build
```

This will launch:
- **Triton Inference Server**
- The PostgreSQL database
- Main application (Spring Boot + React)

#### 3. Launching microservices for interaction with Triton

After launching Triton, go to the `triton_microservices` directory and launch microservices that provide preprocessing and postprocessing of data for each model:

```bash
$ cd triton_microservices
$ docker compose up -d
```

#### 4. Logging in and registering models

After successful launch of all components:

1. Open a browser and navigate to.

2. Log in as an administrator:
 - **Login**: `admin`
 - **Password**: `password`

3. Go to the administrative panel.

4. When creating a new model, specify one of the following URLs corresponding to the available models:
 - `http://localhost:5173/triton/wav2vec2`
 - `http://localhost:5173/triton/unet`
 - `http://localhost:5173/triton/tinyconv`

5. Select the model type — **Triton Inference Server**.

6. Save the model and grant access to your organization.

## Test users
| ROLES                        | LOGIN    | PASSWORD |
|------------------------------|----------|----------|
| **ADMIN, ORGANIZATION_HEAD** | admin    | password |
| **USER**                     | user     | password |
| **USER, ORGANIZATION_HEAD**  | director | password |