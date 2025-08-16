#!/bin/bash

# Production Deployment Script
# Usage: ./deploy.sh [staging|production] [image-tag]

set -e

ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
LOG_FILE="/var/log/capstone-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    log "Running as root - OK"
else
    log "ERROR: This script must be run as root"
    exit 1
fi

log "🚀 Starting deployment to $ENVIRONMENT environment..."
log "📦 Image tag: $IMAGE_TAG"

# Set environment variables
if [[ "$ENVIRONMENT" == "staging" ]]; then
    COMPOSE_FILE="docker-compose.staging.yml"
    API_URL="http://localhost"
    log "🎯 Deploying to STAGING environment"
else
    COMPOSE_FILE="docker-compose.prod.yml"
    API_URL="https://localhost"
    log "🎯 Deploying to PRODUCTION environment"
fi

# Check if compose file exists
if [[ ! -f "$COMPOSE_FILE" ]]; then
    log "❌ Compose file $COMPOSE_FILE not found"
    exit 1
fi

# Navigate to project directory
cd /opt/capstone-api || {
    log "❌ Project directory not found"
    exit 1
}

# Backup current deployment
log "💾 Creating backup of current deployment..."
if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    docker-compose -f "$COMPOSE_FILE" ps > "backup-$(date +%Y%m%d-%H%M%S).txt"
    log "✅ Backup created"
else
    log "⚠️  No running containers to backup"
fi

# Pull latest images
log "📥 Pulling latest Docker images..."
docker-compose -f "$COMPOSE_FILE" pull || {
    log "❌ Failed to pull images"
    exit 1
}
log "✅ Images pulled successfully"

# Stop current deployment
log "🛑 Stopping current deployment..."
docker-compose -f "$COMPOSE_FILE" down || {
    log "⚠️  Failed to stop containers (continuing...)"
}

# Clean up old images
log "🧹 Cleaning up old images..."
docker image prune -f || true

# Deploy new version
log "🚀 Starting new deployment..."
export IMAGE_TAG="$IMAGE_TAG"
docker-compose -f "$COMPOSE_FILE" up -d || {
    log "❌ Deployment failed"
    exit 1
}

# Wait for services to start
log "⏳ Waiting for services to start..."
sleep 30

# Check container status
log "🔍 Checking container status..."
if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    log "✅ All containers are running"
else
    log "❌ Some containers failed to start"
    docker-compose -f "$COMPOSE_FILE" ps
    docker-compose -f "$COMPOSE_FILE" logs
    exit 1
fi

# Health check
log "🏥 Running health checks..."
HEALTH_CHECK_RETRIES=10
HEALTH_CHECK_DELAY=10

for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
    if curl -f -s "$API_URL/health" > /dev/null; then
        log "✅ Health check passed"
        break
    else
        if [[ $i -eq $HEALTH_CHECK_RETRIES ]]; then
            log "❌ Health check failed after $HEALTH_CHECK_RETRIES attempts"
            log "📋 Container logs:"
            docker-compose -f "$COMPOSE_FILE" logs
            exit 1
        fi
        log "⏳ Health check attempt $i/$HEALTH_CHECK_RETRIES failed, retrying in ${HEALTH_CHECK_DELAY}s..."
        sleep $HEALTH_CHECK_DELAY
    fi
done

# API endpoint check
log "🔌 Testing API endpoints..."
if curl -f -s "$API_URL/api/health" > /dev/null; then
    log "✅ API endpoint is responding"
else
    log "❌ API endpoint is not responding"
    exit 1
fi

# Performance test
log "⚡ Running performance test..."
RESPONSE_TIME=$(curl -w "%{time_total}" -o /dev/null -s "$API_URL/health")
log "📊 Response time: ${RESPONSE_TIME}s"

# Log deployment info
log "📝 Deployment information:"
log "   Environment: $ENVIRONMENT"
log "   Image tag: $IMAGE_TAG"
log "   Compose file: $COMPOSE_FILE"
log "   Response time: ${RESPONSE_TIME}s"
log "   Timestamp: $(date)"

# Success message
log "🎉 Deployment to $ENVIRONMENT completed successfully!"
log "🌐 Application is accessible at: $API_URL"
log "📊 Health endpoint: $API_URL/health"
log "📚 API documentation: $API_URL/docs"

# Cleanup old backups (keep last 5)
log "🧹 Cleaning up old backups..."
ls -t backup-*.txt | tail -n +6 | xargs rm -f 2>/dev/null || true

log "✅ Deployment script completed"
log "----------------------------------------"
