#!/bin/bash

# Production Monitoring Script
# Usage: ./monitor.sh [staging|production]

ENVIRONMENT=${1:-production}
LOG_FILE="/var/log/capstone-monitor.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

log "Starting monitoring for $ENVIRONMENT environment..."

# Check Docker status
log "Checking Docker status..."
if systemctl is-active --quiet docker; then
    log "✅ Docker is running"
else
    log "❌ Docker is not running"
    systemctl start docker
    log "🔄 Started Docker service"
fi

# Check containers
log "Checking container status..."
cd /opt/capstone-api

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    log "✅ All containers are running"
else
    log "❌ Some containers are not running"
    docker-compose -f docker-compose.prod.yml ps
fi

# Check container health
log "Checking container health..."
for container in $(docker-compose -f docker-compose.prod.yml ps -q); do
    container_name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/\///')
    health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-health-check")
    
    if [[ "$health_status" == "healthy" ]]; then
        log "✅ $container_name: $health_status"
    elif [[ "$health_status" == "no-health-check" ]]; then
        log "⚠️  $container_name: no health check configured"
    else
        log "❌ $container_name: $health_status"
    fi
done

# Check API endpoints
log "Checking API endpoints..."
API_URL="http://localhost"
if [[ "$ENVIRONMENT" == "production" ]]; then
    API_URL="https://localhost"
fi

# Health check
if curl -f -s "$API_URL/health" > /dev/null; then
    log "✅ Health endpoint is responding"
else
    log "❌ Health endpoint is not responding"
fi

# API check
if curl -f -s "$API_URL/api/health" > /dev/null; then
    log "✅ API endpoint is responding"
else
    log "❌ API endpoint is not responding"
fi

# Check disk space
log "Checking disk space..."
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [[ $DISK_USAGE -gt 80 ]]; then
    log "⚠️  Disk usage is high: ${DISK_USAGE}%"
else
    log "✅ Disk usage is normal: ${DISK_USAGE}%"
fi

# Check memory usage
log "Checking memory usage..."
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
    log "⚠️  Memory usage is high: ${MEMORY_USAGE}%"
else
    log "✅ Memory usage is normal: ${MEMORY_USAGE}%"
fi

# Check recent logs for errors
log "Checking recent logs for errors..."
ERROR_COUNT=$(docker logs --since 1h capstone-api-prod 2>&1 | grep -i "error\|exception\|fatal" | wc -l)
if [[ $ERROR_COUNT -gt 0 ]]; then
    log "⚠️  Found $ERROR_COUNT errors in recent logs"
else
    log "✅ No errors found in recent logs"
fi

# Check SSL certificate expiry (production only)
if [[ "$ENVIRONMENT" == "production" ]]; then
    log "Checking SSL certificate expiry..."
    CERT_FILE="/opt/capstone-api/nginx/ssl/cert.pem"
    if [[ -f "$CERT_FILE" ]]; then
        EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
        CURRENT_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
        
        if [[ $DAYS_LEFT -lt 30 ]]; then
            log "⚠️  SSL certificate expires in $DAYS_LEFT days"
        else
            log "✅ SSL certificate expires in $DAYS_LEFT days"
        fi
    else
        log "❌ SSL certificate file not found"
    fi
fi

log "Monitoring completed for $ENVIRONMENT environment"
log "----------------------------------------"
