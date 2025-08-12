# PowerShell script để test API
# Sử dụng: .\test-api.ps1

$BASE_URL = "http://localhost:3000"
$API_BASE = "$BASE_URL/api"

# Test data
$testUser = @{
    name = "Test User"
    email = "test@example.com"
    pass_word = "password123"
    phone = "0123456789"
    birth_day = "1990-01-01"
    gender = "Nam"
    role = "freelancer"
    skill = "Testing, API"
    certification = "Test Certification"
}

$global:authToken = $null

# Helper function to log results
function Write-TestResult {
    param(
        [string]$TestName,
        [bool]$Success,
        [string]$Details = ""
    )
    
    $status = if ($Success) { "✅ PASS" } else { "❌ FAIL" }
    Write-Host "$status $TestName" -ForegroundColor $(if ($Success) { "Green" } else { "Red" })
    if ($Details) {
        Write-Host "   $Details" -ForegroundColor "Yellow"
    }
}

# Test health check
function Test-HealthCheck {
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get
        Write-TestResult "Health Check" $true "Status: OK, Uptime: $($response.uptime)s"
        return $true
    }
    catch {
        Write-TestResult "Health Check" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test API root
function Test-APIRoot {
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/" -Method Get
        Write-TestResult "API Root" $true "Response: $response"
        return $true
    }
    catch {
        Write-TestResult "API Root" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test user registration
function Test-UserRegistration {
    try {
        $body = $testUser | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$API_BASE/auth/signup" -Method Post -Body $body -ContentType "application/json"
        Write-TestResult "User Registration" $true "User ID: $($response.content.id)"
        return $true
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-TestResult "User Registration" $true "User already exists (expected)"
            return $true
        }
        Write-TestResult "User Registration" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test user login
function Test-UserLogin {
    try {
        $loginData = @{
            email = $testUser.email
            pass_word = $testUser.pass_word
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_BASE/auth/signin" -Method Post -Body $loginData -ContentType "application/json"
        $global:authToken = $response.content.token
        
        if ($global:authToken) {
            Write-TestResult "User Login" $true "Token received successfully"
            return $true
        } else {
            Write-TestResult "User Login" $false "No token received"
            return $false
        }
    }
    catch {
        Write-TestResult "User Login" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test get users (public)
function Test-GetUsers {
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/users" -Method Get
        $userCount = $response.content.data.Count
        Write-TestResult "Get Users" $true "Users count: $userCount"
        return $true
    }
    catch {
        Write-TestResult "Get Users" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test get jobs (public)
function Test-GetJobs {
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/jobs" -Method Get
        $jobCount = $response.content.data.Count
        Write-TestResult "Get Jobs" $true "Jobs count: $jobCount"
        return $true
    }
    catch {
        Write-TestResult "Get Jobs" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test get job categories
function Test-GetJobCategories {
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/jobs/categories/list" -Method Get
        $categoryCount = $response.content.Count
        Write-TestResult "Get Job Categories" $true "Categories count: $categoryCount"
        return $true
    }
    catch {
        Write-TestResult "Get Job Categories" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test protected endpoints with token
function Test-ProtectedEndpoints {
    if (-not $global:authToken) {
        Write-TestResult "Protected Endpoints" $false "No auth token available"
        return $false
    }

    $headers = @{
        "Authorization" = "Bearer $global:authToken"
        "Content-Type" = "application/json"
    }
    
    $success = $true

    try {
        # Test get profile
        $profileResponse = Invoke-RestMethod -Uri "$API_BASE/users/profile/me" -Method Get -Headers $headers
        Write-TestResult "Get Profile (Protected)" $true "Profile retrieved successfully"
    }
    catch {
        Write-TestResult "Get Profile (Protected)" $false "Error: $($_.Exception.Message)"
        $success = $false
    }

    try {
        # Test create job
        $jobData = @{
            ten_cong_viec = "Test Job"
            gia_tien = 1000000
            mo_ta = "This is a test job"
            ma_chi_tiet_loai = 1
        } | ConvertTo-Json
        
        $jobResponse = Invoke-RestMethod -Uri "$API_BASE/jobs" -Method Post -Body $jobData -Headers $headers
        Write-TestResult "Create Job (Protected)" $true "Job ID: $($jobResponse.content.id)"
    }
    catch {
        Write-TestResult "Create Job (Protected)" $false "Error: $($_.Exception.Message)"
        $success = $false
    }

    return $success
}

# Test Swagger documentation
function Test-SwaggerDocs {
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/api-docs" -Method Get
        Write-TestResult "Swagger Documentation" $true "Documentation accessible"
        return $true
    }
    catch {
        Write-TestResult "Swagger Documentation" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Main test runner
function Start-APITests {
    Write-Host "🚀 Starting API Tests..." -ForegroundColor "Cyan"
    Write-Host ""
    
    $tests = @(
        @{ Name = "Health Check"; Function = "Test-HealthCheck" },
        @{ Name = "API Root"; Function = "Test-APIRoot" },
        @{ Name = "User Registration"; Function = "Test-UserRegistration" },
        @{ Name = "User Login"; Function = "Test-UserLogin" },
        @{ Name = "Get Users (Public)"; Function = "Test-GetUsers" },
        @{ Name = "Get Jobs (Public)"; Function = "Test-GetJobs" },
        @{ Name = "Get Job Categories"; Function = "Test-GetJobCategories" },
        @{ Name = "Protected Endpoints"; Function = "Test-ProtectedEndpoints" },
        @{ Name = "Swagger Documentation"; Function = "Test-SwaggerDocs" }
    )

    $passed = 0
    $total = $tests.Count

    foreach ($test in $tests) {
        Write-Host "🧪 Testing: $($test.Name)" -ForegroundColor "Yellow"
        $result = & $test.Function
        if ($result) { $passed++ }
        
        # Small delay between tests
        Start-Sleep -Seconds 1
    }

    Write-Host ""
    Write-Host ("=" * 50) -ForegroundColor "Magenta"
    Write-Host "📊 Test Results: $passed/$total tests passed" -ForegroundColor "Cyan"
    
    if ($passed -eq $total) {
        Write-Host "🎉 All tests passed! API is working correctly." -ForegroundColor "Green"
    } else {
        Write-Host "⚠️  Some tests failed. Please check the errors above." -ForegroundColor "Red"
    }
    
    Write-Host ("=" * 50) -ForegroundColor "Magenta"
}

# Run tests if this script is executed directly
if ($MyInvocation.InvocationName -eq $MyInvocation.MyCommand.Name) {
    Start-APITests
}

# Export functions for external use
Export-ModuleMember -Function @(
    "Test-HealthCheck",
    "Test-APIRoot", 
    "Test-UserRegistration",
    "Test-UserLogin",
    "Test-GetUsers",
    "Test-GetJobs",
    "Test-GetJobCategories",
    "Test-ProtectedEndpoints",
    "Test-SwaggerDocs",
    "Start-APITests"
)
