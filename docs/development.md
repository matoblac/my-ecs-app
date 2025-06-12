# Development.md

The project encompasses:

- Frontend: React-based user interface for chat interactions

- Backend: ECS-managed service for real-time chat, vector search, and Bedrock integration

- Infrastructure: AWS CDK for provisioning Aurora PostgreSQL (with pgvector), ECS, IAM, Secrets Manager, and Bedrock Agent integration

## Components ReadMe

- [Frontend](../frontend/README.md)
- [Backend](../backend/ReadMe.md)
- [Infrastructure](../backend/src/infrastructure/ReadMe.md)

## Local Development

```bash
git clone https://github.com/matoblac/my-ecs-app.git
cd my-ecs-app
npm install
npm run build
npm start
# or for Docker:
# This is containerized application with both frontend and backend in the same ecs task -> same ecs task? why?(this means they can communicate via websockets)
docker build -t my-ecs-app .
docker run -p 3000:3000 my-ecs-app
```

## Testing 
includes tests for frontend and backend and github actions for e2e tests

## Deployment 
1. `aws configure` credentials
2. create the ECR repositories: `./scripts/setup-ecr.sh`
3. npm run build and cdk deploy the application
4. deploy the frontend and backend: `./scripts/deploy-all.sh`
5. The deployment will create a new ECS cluster, a new ECR repo, and a new ECS service and pull the image from the ECR repo




