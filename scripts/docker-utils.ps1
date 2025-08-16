# ========================================
# CAPSTONE FIVERR DOCKER UTILITIES (PowerShell)
# ========================================

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Success "Docker is running"
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker first."
        return $false
    }
}

# Function to build and start development environment
function Start-DevEnvironment {
    Write-Status "Starting development environment..."
    
    if (-not (Test-Docker)) { return }
    
    # Stop existing containers
    docker-compose down
    
    # Build and start development environment
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
    
    Write-Success "Development environment started successfully!"
    Write-Status "API: http://localhost:3000"
    Write-Status "MySQL: localhost:3307"
}

# Function to start production environment
function Start-ProdEnvironment {
    Write-Status "Starting production environment..."
    
    if (-not (Test-Docker)) { return }
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down
    
    # Start production environment
    docker-compose -f docker-compose.prod.yml up -d
    
    Write-Success "Production environment started successfully!"
    Write-Status "API: http://localhost:3000"
    Write-Status "MySQL: localhost:3307"
}

# Function to stop all containers
function Stop-AllContainers {
    Write-Status "Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    Write-Success "All containers stopped"
}

# Function to view logs
function Show-Logs {
    param([string]$Service = "api")
    Write-Status "Showing logs for service: $Service"
    docker-compose logs -f $Service
}

# Function to rebuild containers
function Rebuild-Containers {
    Write-Status "Rebuilding containers..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    Write-Success "Containers rebuilt and started"
}

# Function to clean up Docker resources
function Cleanup-Docker {
    Write-Status "Cleaning up Docker resources..."
    
    # Stop all containers
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    
    # Remove unused containers, networks, and images
    docker system prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    Write-Success "Cleanup completed"
}

# Function to show container status
function Show-Status {
    Write-Status "Container status:"
    docker-compose ps
    
    Write-Host ""
    Write-Status "Production containers:"
    docker-compose -f docker-compose.prod.yml ps
}

# Function to show help
function Show-Help {
    Write-Host "Usage: .\docker-utils.ps1 [COMMAND]" -ForegroundColor $White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor $White
    Write-Host "  dev-up     Start development environment" -ForegroundColor $White
    Write-Host "  prod-up    Start production environment" -ForegroundColor $White
    Write-Host "  down       Stop all containers" -ForegroundColor $White
    Write-Host "  logs       Show logs for a service (default: api)" -ForegroundColor $White
    Write-Host "  rebuild    Rebuild and restart containers" -ForegroundColor $White
    Write-Host "  cleanup    Clean up Docker resources" -ForegroundColor $White
    Write-Host "  status     Show container status" -ForegroundColor $White
    Write-Host "  help       Show this help message" -ForegroundColor $White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor $White
    Write-Host "  .\scripts\docker-utils.ps1 dev-up" -ForegroundColor $White
    Write-Host "  .\scripts\docker-utils.ps1 logs mysql" -ForegroundColor $White
    Write-Host "  .\scripts\docker-utils.ps1 cleanup" -ForegroundColor $White
}

# Main script logic
switch ($Command.ToLower()) {
    "dev-up" {
        Start-DevEnvironment
    }
    "prod-up" {
        Start-ProdEnvironment
    }
    "down" {
        Stop-AllContainers
    }
    "logs" {
        Show-Logs
    }
    "rebuild" {
        Rebuild-Containers
    }
    "cleanup" {
        Cleanup-Docker
    }
    "status" {
        Show-Status
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
    }
}
