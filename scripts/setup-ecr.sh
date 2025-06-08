#!/bin/bash
# === ECR REPOSITORY SETUP ===
# File: setup-ecr.sh
# Run this ONCE to create your ECR repositories

set -e

AWS_REGION="us-east-1"

echo "Creating ECR repositories..."

# Create frontend repository
aws ecr create-repository \
  --repository-name chatbot-frontend \
  --region "$AWS_REGION" \
  --image-scanning-configuration scanOnPush=true \
  || echo "Frontend repository already exists"

# Create backend repository  
aws ecr create-repository \
  --repository-name chatbot-backend \
  --region "$AWS_REGION" \
  --image-scanning-configuration scanOnPush=true \
  || echo "Backend repository already exists"

echo "✅ ECR repositories created:"
echo "   - chatbot-frontend"
echo "   - chatbot-backend"

# Get repository URIs
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo ""
echo "📋 Your repository URIs:"
echo "Frontend: $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/chatbot-frontend"
echo "Backend:  $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/chatbot-backend"