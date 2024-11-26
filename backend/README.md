# Set up instructions

### Clone source code
`git clone git@github.com:timnqp/generations-backend.git`

### Install packages
We use node version `20.9.0`.

`npm install`

### Run local lambda functions
We use sls version `3.38.0`. If there is a warning about puny, make sure your node version is correct.

`sls offline` or `npx serverless offline`

Lambda functions can be accessed locally, normally via _http://localhost:3000_ or specified by Serverless framework

### Unit Tests
`npm run test`

In future, this can help you test coverage as well.
To understand more, please read the [Jest Cheatsheet](https://devhints.io/jest), and have a look on file src/`tests/jest_cheatsheet.test.ts` and `jest_cheatsheet.ts`

### Local DynamoDB

_To be updated_

## Deployment guidelines
Following guidelines if for deploying from local machine. For automation, deployment with GitHub Actions will be integrated later.

### Step 1: Setup AWS credentials profile
Currently, AWS profile named `generations-dev` is fixed for development environment.
`aws configure --profile generations-dev`
Please contact the team for the credentials.

### Step 2: Deploy
Deployment configurations are specified in `serverless.yml` file. To deploy run the following command
`sls deploy`
