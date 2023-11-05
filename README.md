# DevOps Task2: Dockerized CI/CD with GitLab

In this task, I have created a simple web application, set up a GitLab repository, implemented Continuous Integration/Continuous Deployment (CI/CD) using GitLab CI/CD, and deployed the application using Docker. 
The goal is to understand how to automate the build, test, and deployment processes of a containerized application.

## 1. Application Development
I have chosen Express.js to create a simple web application which is actually a basic "Hello World" webpage. Here is my project structure and files:

![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/768dfa37-f819-4172-bee9-31935decac0d)

Here is the webpage:

![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/34a00576-8a61-47a5-9fea-4c57676e46d7)

I have added the application code to this repository.

## 2. Dockerizing the Application
This Dockerfile is a set of instructions for Docker to assemble an image for a containerized application. Here is the content of the Dockerfile for this application:

![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/e29ddab9-fb8d-4e4e-b0ae-d92cbcafdef9)

To explain each part of the Dockerfile:
* *Base Image*: Starts with a base image **node:16-alpine**, which is a minimal Node.js version 16 image built on Alpine Linux. Alpine Linux is chosen for its small size and reduced attack surface, making the container more secure and faster to deploy.
* *Working Directory*: Sets **/usr/src/app** as the working directory in the container. Any following commands in the Dockerfile will be executed in this directory within the container.
* *Copy Package Files*: Copies **package.json** and **package-lock.json** to the working directory inside the container. These files define the project dependencies.
* *Install Dependencies*: Runs **npm install --only=production**, which installs the production dependencies defined in package.json. This does not install packages listed in devDependencies.
* *Copy Source Code*: Copies the rest of the source code from the host's current directory to the container's working directory. The **.** denotes the current directory on both the host and container.
* *Expose Port*: Informs Docker that the container listens on network port **3000** at runtime. This does not actually publish the port; it serves as documentation and is used by Docker networking.
* *Command to Run the App*: Finally, it defines the command `CMD ["node", "server.js"]` that will be executed when the Docker container starts. This command starts the Node.js application by running **server.js** with Node.js.

I also added node_modules, npm-debug.log, and .git files to .dockerignore file to exclude unecessary files from Docker image.

## 3. GitLab Setup
I have created a new GitLab project for my web application: https://gitlab.com/Gardashaliyeva/devops_task2

## 4. GitLab CI/CD Configuration and Depolyment with Docker
To define the CI/CD pipeline configuration for a project hosted on GitLab, I have created a .gitlab-ci.yml file:

![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/2c6fb6c0-4a85-411b-97ce-05484f3b77c9)

- **Stages**: Defines three stages that will be executed in the given order: `test`, `build`, and `deploy`. These stages organize the jobs within the pipeline.
- **Variables**: Sets global variables that will be used throughout the pipeline:
  - `IMAGE_NAME` is the name of the Docker image to be created (gardashaliyeva/devops_task2).
  - `IMAGE_TAG` is the tag for the Docker image (node_1).
    
  I have created a docker image for Node.js application on Docker Hub:
  
  ![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/ac8ae177-a2c9-4120-9d88-815dfc66063d)

- **Test Stage**: Contains instructions for the `test` job:
  - Uses the `node:16-alpine` Docker image to run the job.
  - The `script` commands install the project dependencies with `npm install` and then run tests with `npm test`.
  - This job is part of the `test` stage, as specified.
- **Build Stage**: Contains instructions for the `build` job:
  - Uses the `docker:latest` Docker image to run the job, indicating the use of Docker commands in the script.
  - Uses `docker:dind` (Docker in Docker) service, allowing Docker commands to be run within the Docker executor.
  - The `before_script` is executed before the main script and logs into the Docker registry using the `CI_REGISTRY_USER` and `CI_REGISTRY_PASSWORD` variables.
  - The `script` commands build the Docker image with `docker build`, tag it with the specified `IMAGE_NAME` and `IMAGE_TAG`, and then push it to the Docker registry.
  - This job is part of the `build` stage.
- **Deploy Stage**: Contains instructions for the `deploy` job:
  - This job also executes during the `deploy` stage after `build` completes.
  - The `before_script` changes the permissions of the SSH private key to be more secure with `chmod 400`.
  - The `script`:
    - Logs into the server using SSH with the private key, disabling strict host key checking for automation purposes.
    - Logs into the Docker registry and pulls the newly built image.
    - Stops and removes all running containers.
    - Runs a new container from the built image, mapping port 5000 of the container to port 5000 of the host.
  - The `only` directive specifies that this job should only run for the `main` branch.

The file is structured to first run tests on the codebase, then build a Docker image if the tests pass, and finally deploy the new Docker image to a server by restarting the Docker container with the new image.

I have defined the necessary variables in GitLab CI/CD Settings:

![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/e3199ede-11a3-4265-892a-6d5f9777431b)

The container created with the image on Docker Desktop:

![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/284d601e-2ad6-48cd-b2cf-2318d055380c)

## 5. Testing 
I have written test cases for this web application  using `supertest` and Jest. The CI/CD pipeline runs these test cases automatically during the testing stage. The brief overview of the test cases:
- *Test Case 1*: **GET /**: Confirms the main page loads with a `200` status and contains `<h1>Hello World!</h1>`.
- *Test Case 2*: **POST /echo**: Tests if the echo endpoint correctly returns a provided message with a `200` status.
- *Test Case 3*: **GET /add/:num1/:num2**: Includes two tests for an addition endpoint:
  1. Validates correct addition of two valid numbers, expecting the sum in the response.
  2. Checks how the endpoint handles invalid number inputs, expecting a `400` status for bad requests.
- **Clean-up**: Closes the server after all tests run using Jest's `afterAll` hook.

The result of test cases on terminal:

![image](https://github.com/Gardashaliyeva/devops_task2/assets/94057319/06cde289-4367-44e3-891e-17daa9d93ce9)
