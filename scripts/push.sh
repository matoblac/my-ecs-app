#!/bin/bash
set -e

# push the image to the ECR repo
# this script is used to push the image to the ECR repo

# === Config ===
AWS_REGION="us-east-1"
REPO_NAME="my-ecs-app"       # Replace with your ECR repo name
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IMAGE_TAG=$(git rev-parse --short HEAD)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME"

echo "📦 Building Docker image: $ECR_URI:$IMAGE_TAG"

# === Authenticate ===
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# === Build and Tag ===
docker build -t "$ECR_URI:$IMAGE_TAG" .
docker tag "$ECR_URI:$IMAGE_TAG" "$ECR_URI:latest"

# === Push both tags ===
docker push "$ECR_URI:$IMAGE_TAG"
docker push "$ECR_URI:latest"

echo "✅ Image pushed successfully:"
echo "   - $ECR_URI:$IMAGE_TAG"
echo "   - $ECR_URI:latest"

