#!/bin/bash

# Zero Net Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

MODE=${1:-dev}

echo "🚀 Zero Net Deployment Script"
echo "================================"
echo "Mode: $MODE"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker first:"
    echo "  macOS: brew install --cask docker"
    echo "  Linux: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "Please create .env.local with your environment variables"
    exit 1
fi

# Function to deploy in development mode
deploy_dev() {
    echo "📦 Building Docker image..."
    docker-compose build
    
    echo "🔄 Starting containers..."
    docker-compose up -d
    
    echo "✅ Deployment complete!"
    echo "🌐 Application is running at http://localhost:3000"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f    # View logs"
    echo "  docker-compose down       # Stop containers"
    echo "  docker-compose restart    # Restart containers"
}

# Function to deploy in production mode
deploy_prod() {
    echo "📦 Building Docker image..."
    docker-compose -f docker-compose.prod.yml build
    
    echo "🔄 Starting containers..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "✅ Deployment complete!"
    echo "🌐 Application is running at http://localhost"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose -f docker-compose.prod.yml logs -f    # View logs"
    echo "  docker-compose -f docker-compose.prod.yml down       # Stop containers"
    echo "  docker-compose -f docker-compose.prod.yml restart    # Restart containers"
}

# Deploy based on mode
case $MODE in
    dev)
        deploy_dev
        ;;
    prod)
        deploy_prod
        ;;
    *)
        echo "❌ Invalid mode: $MODE"
        echo "Usage: ./deploy.sh [dev|prod]"
        exit 1
        ;;
esac

echo ""
echo "📊 Container status:"
docker ps

echo ""
echo "💡 Tip: Run 'docker-compose logs -f' to view real-time logs"
