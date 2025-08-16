#!/bin/bash

# ========================================
# CAPSTONE FIVERR DOCKER UTILITIES
# ========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to build and start development environment
dev_up() {
    print_status "Starting development environment..."
    check_docker
    
    # Stop existing containers
    docker-compose down
    
    # Build and start development environment
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
    
    print_success "Development environment started successfully!"
    print_status "API: http://localhost:3000"
    print_status "MySQL: localhost:3307"
}

# Function to start production environment
prod_up() {
    print_status "Starting production environment..."
    check_docker
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down
    
    # Start production environment
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Production environment started successfully!"
    print_status "API: http://localhost:3000"
    print_status "MySQL: localhost:3307"
}

# Function to stop all containers
down() {
    print_status "Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    print_success "All containers stopped"
}

# Function to view logs
logs() {
    local service=${1:-api}
    print_status "Showing logs for service: $service"
    docker-compose logs -f $service
}

# Function to rebuild containers
rebuild() {
    print_status "Rebuilding containers..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Containers rebuilt and started"
}

# Function to clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    
    # Stop all containers
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    
    # Remove unused containers, networks, and images
    docker system prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    print_success "Cleanup completed"
}

# Function to show container status
status() {
    print_status "Container status:"
    docker-compose ps
    
    echo ""
    print_status "Production containers:"
    docker-compose -f docker-compose.prod.yml ps
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev-up     Start development environment"
    echo "  prod-up    Start production environment"
    echo "  down       Stop all containers"
    echo "  logs       Show logs for a service (default: api)"
    echo "  rebuild    Rebuild and restart containers"
    echo "  cleanup    Clean up Docker resources"
    echo "  status     Show container status"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev-up"
    echo "  $0 logs mysql"
    echo "  $0 cleanup"
}

# Main script logic
case "${1:-help}" in
    "dev-up")
        dev_up
        ;;
    "prod-up")
        prod_up
        ;;
    "down")
        down
        ;;
    "logs")
        logs "$2"
        ;;
    "rebuild")
        rebuild
        ;;
    "cleanup")
        cleanup
        ;;
    "status")
        status
        ;;
    "help"|*)
        show_help
        ;;
esac
