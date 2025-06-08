#!/bin/bash
# === COMBINED DEPLOYMENT SCRIPT ===
# File: deploy-all.sh
# Run this to deploy both frontend and backend

set -e

echo "Starting full deployment..."

# Deploy frontend
echo "Deploying frontend..."
./deploy-frontend.sh

echo "Waiting 30 seconds before backend deployment..."
sleep 30

# Deploy backend
echo "Deploying backend..."
./deploy-backend.sh

echo "Full deployment complete!"
echo "Check your application at the ALB DNS name"