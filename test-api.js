const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  pass_word: 'password123',
  phone: '0123456789',
  birth_day: '1990-01-01',
  gender: 'Nam',
  role: 'freelancer',
  skill: 'Testing, API',
  certification: 'Test Certification'
};

let authToken = null;

// Helper function to log results
const logResult = (testName, success, details = '') => {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}`);
  if (details) console.log(`   ${details}`);
};

// Test health check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logResult('Health Check', response.status === 200, `Status: ${response.status}`);
    return true;
  } catch (error) {
    logResult('Health Check', false, `Error: ${error.message}`);
    return false;
  }
}

// Test API root
async function testAPIRoot() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    logResult('API Root', response.status === 200, `Response: ${response.data}`);
    return true;
  } catch (error) {
    logResult('API Root', false, `Error: ${error.message}`);
    return false;
  }
}

// Test user registration
async function testUserRegistration() {
  try {
    const response = await axios.post(`${API_BASE}/auth/signup`, testUser);
    logResult('User Registration', response.status === 201, `User ID: ${response.data.content?.id}`);
    return true;
  } catch (error) {
    if (error.response?.status === 409) {
      logResult('User Registration', true, 'User already exists (expected)');
      return true;
    }
    logResult('User Registration', false, `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test user login
async function testUserLogin() {
  try {
    const loginData = {
      email: testUser.email,
      pass_word: testUser.pass_word
    };
    const response = await axios.post(`${API_BASE}/auth/signin`, loginData);
    authToken = response.data.content?.token;
    logResult('User Login', response.status === 200 && authToken, `Token: ${authToken ? 'Received' : 'Missing'}`);
    return !!authToken;
  } catch (error) {
    logResult('User Login', false, `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test get users (public)
async function testGetUsers() {
  try {
    const response = await axios.get(`${API_BASE}/users`);
    logResult('Get Users', response.status === 200, `Users count: ${response.data.content?.data?.length || 0}`);
    return true;
  } catch (error) {
    logResult('Get Users', false, `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test get jobs (public)
async function testGetJobs() {
  try {
    const response = await axios.get(`${API_BASE}/jobs`);
    logResult('Get Jobs', response.status === 200, `Jobs count: ${response.data.content?.data?.length || 0}`);
    return true;
  } catch (error) {
    logResult('Get Jobs', false, `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test get job categories
async function testGetJobCategories() {
  try {
    const response = await axios.get(`${API_BASE}/jobs/categories/list`);
    logResult('Get Job Categories', response.status === 200, `Categories count: ${response.data.content?.length || 0}`);
    return true;
  } catch (error) {
    logResult('Get Job Categories', false, `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test protected endpoints with token
async function testProtectedEndpoints() {
  if (!authToken) {
    logResult('Protected Endpoints', false, 'No auth token available');
    return false;
  }

  const headers = { Authorization: `Bearer ${authToken}` };
  let success = true;

  try {
    // Test get profile
    const profileResponse = await axios.get(`${API_BASE}/users/profile/me`, { headers });
    logResult('Get Profile (Protected)', profileResponse.status === 200, 'Profile retrieved successfully');
  } catch (error) {
    logResult('Get Profile (Protected)', false, `Error: ${error.response?.data?.message || error.message}`);
    success = false;
  }

  try {
    // Test create job
    const jobData = {
      ten_cong_viec: 'Test Job',
      gia_tien: 1000000,
      mo_ta: 'This is a test job',
      ma_chi_tiet_loai: 1
    };
    const jobResponse = await axios.post(`${API_BASE}/jobs`, jobData, { headers });
    logResult('Create Job (Protected)', jobResponse.status === 201, `Job ID: ${jobResponse.data.content?.id}`);
  } catch (error) {
    logResult('Create Job (Protected)', false, `Error: ${error.response?.data?.message || error.message}`);
    success = false;
  }

  return success;
}

// Test Swagger documentation
async function testSwaggerDocs() {
  try {
    const response = await axios.get(`${BASE_URL}/api-docs`);
    logResult('Swagger Documentation', response.status === 200, 'Documentation accessible');
    return true;
  } catch (error) {
    logResult('Swagger Documentation', false, `Error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'API Root', fn: testAPIRoot },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Get Users (Public)', fn: testGetUsers },
    { name: 'Get Jobs (Public)', fn: testGetJobs },
    { name: 'Get Job Categories', fn: testGetJobCategories },
    { name: 'Protected Endpoints', fn: testProtectedEndpoints },
    { name: 'Swagger Documentation', fn: testSwaggerDocs }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    console.log(`\n🧪 Testing: ${test.name}`);
    const result = await test.fn();
    if (result) passed++;
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('='.repeat(50));
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testAPIRoot,
  testUserRegistration,
  testUserLogin,
  testGetUsers,
  testGetJobs,
  testGetJobCategories,
  testProtectedEndpoints,
  testSwaggerDocs,
  runAllTests
};
