#!/usr/bin/env node

console.log('🚀 Initializing Capstone Fiverr API Project...\n');

const fs = require('fs');
const { execSync } = require('child_process');

// Check .env file
if (!fs.existsSync('.env') && fs.existsSync('env.example')) {
  console.log('📝 Creating .env file...');
  fs.copyFileSync('env.example', '.env');
  console.log('✅ .env file created');
}

// Install dependencies
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

// Generate Prisma client
if (!fs.existsSync('generated/prisma')) {
  console.log('🔧 Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Prisma generation failed');
  }
}

// Create directories
['uploads', 'logs'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created ${dir} directory`);
  }
});

console.log('\n✅ Project initialization completed!');
console.log('📋 Next steps:');
console.log('1. Update .env with database credentials');
console.log('2. Run: npm run start:dev');
console.log('3. Access API at: http://localhost:3000/api/v1');
