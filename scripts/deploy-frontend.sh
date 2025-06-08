#!/bin/bash
# === FRONTEND DEPLOYMENT SCRIPT ===
# File: deploy-frontend.sh

set -e

# === Config ===
AWS_REGION="us-east-1"
REPO_NAME="chatbot-frontend"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IMAGE_TAG=$(git rev-parse --short HEAD)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME"

echo "📦 Building Frontend Docker image: $ECR_URI:$IMAGE_TAG"

# === Authenticate ===
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# === Build and Tag ===
docker build -t "$ECR_URI:$IMAGE_TAG" .
docker tag "$ECR_URI:$IMAGE_TAG" "$ECR_URI:latest"

# === Push both tags ===
docker push "$ECR_URI:$IMAGE_TAG"
docker push "$ECR_URI:latest"

echo "✅ Frontend image pushed successfully:"
echo "   - $ECR_URI:$IMAGE_TAG"
echo "   - $ECR_URI:latest"

# === Force ECS Service Update ===
echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster chatbot-cluster \
  --service chatbot-service \
  --force-new-deployment \
  --region "$AWS_REGION"

echo "✅ ECS service update initiated"