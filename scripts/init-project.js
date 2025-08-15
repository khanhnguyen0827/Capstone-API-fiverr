#!/usr/bin/env node

/**
 * Project Initialization Script
 * This script sets up the project environment and database
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Initializing Capstone Fiverr API Project...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n${step} ${description}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if .env file exists
logStep('1', 'Checking environment configuration...');
if (!fs.existsSync('.env')) {
  if (fs.existsSync('env.example')) {
    logInfo('Creating .env file from env.example...');
    fs.copyFileSync('env.example', '.env');
    logSuccess('.env file created successfully');
  } else {
    logWarning('env.example not found. Please create .env file manually.');
  }
} else {
  logSuccess('.env file already exists');
}

// Check if node_modules exists
logStep('2', 'Checking dependencies...');
if (!fs.existsSync('node_modules')) {
  logInfo('Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Dependencies installed successfully');
  } catch (error) {
    logError('Failed to install dependencies');
    process.exit(1);
  }
} else {
  logSuccess('Dependencies already installed');
}

// Check if Prisma client exists
logStep('3', 'Checking Prisma setup...');
if (!fs.existsSync('generated/prisma')) {
  logInfo('Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    logSuccess('Prisma client generated successfully');
  } catch (error) {
    logError('Failed to generate Prisma client');
    logWarning('Please check your database connection and Prisma schema');
  }
} else {
  logSuccess('Prisma client already exists');
}

// Check database connection
logStep('4', 'Checking database connection...');
try {
  execSync('npx prisma db pull', { stdio: 'inherit' });
  logSuccess('Database connection successful');
} catch (error) {
  logWarning('Database connection failed');
  logInfo('Please ensure your MySQL server is running and DATABASE_URL is correct in .env');
}

// Create uploads directory
logStep('5', 'Creating necessary directories...');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logSuccess('Uploads directory created');
} else {
  logSuccess('Uploads directory already exists');
}

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logSuccess('Logs directory created');
} else {
  logSuccess('Logs directory already exists');
}

// Build project
logStep('6', 'Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  logSuccess('Project built successfully');
} catch (error) {
  logWarning('Project build failed');
  logInfo('Please check for TypeScript errors');
}

// Final instructions
logStep('7', 'Project initialization completed!');
log('\n📋 Next steps:', 'bright');
log('1. Update your .env file with correct database credentials', 'yellow');
log('2. Ensure MySQL server is running', 'yellow');
log('3. Run: npm run start:dev', 'green');
log('4. Access API at: http://localhost:3000/api/v1', 'green');
log('5. Access Swagger docs at: http://localhost:3000/api-docs', 'green');

log('\n🔑 Default admin credentials:', 'bright');
log('Email: admin@capstone.com', 'yellow');
log('Password: admin123', 'yellow');

log('\n📚 Available commands:', 'bright');
log('npm run start:dev    - Start development server', 'cyan');
log('npm run build        - Build project', 'cyan');
log('npm run start:prod   - Start production server', 'cyan');
log('npm run test         - Run tests', 'cyan');
log('npx prisma studio    - Open Prisma Studio', 'cyan');

log('\n🎉 Happy coding!', 'magenta');
