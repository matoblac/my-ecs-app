# my-ecs-app

A minimal Node.js app ready for AWS SDK, Express, and Docker.

## Current Status

[![E2E Tests](https://github.com/matoblac/my-ecs-app/actions/workflows/playwright.yml/badge.svg)](https://github.com/matoblac/my-ecs-app/actions/workflows/playwright.yml)

```bash
git clone https://github.com/matoblac/my-ecs-app.git
cd my-ecs-app
npm install
npm run build
npm start
# or for Docker:
docker build -t my-ecs-app .
docker run -p 3000:3000 my-ecs-app
```

## Testing 
includes tests for frontend and backend and github actions for e2e tests

## Deployment 
1. `aws configure` credentials
2. use scripts/push.sh to push the image to the ECR repo
3. cdk deploy the application
4. The deployment will create a new ECS cluster, a new ECR repo, and a new ECS service and pull the image from the ECR repo
