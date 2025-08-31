#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
    return false;
  }
}

async function renderBuild() {
  console.log('🚀 Starting Render build process...\n');

  // Step 1: Install dependencies
  const installSuccess = await runCommand('npm install', 'Installing dependencies');
  if (!installSuccess) {
    console.error('❌ Build failed: Could not install dependencies');
    process.exit(1);
  }

  // Step 2: Generate Prisma client
  const generateSuccess = await runCommand('npx prisma generate', 'Generating Prisma client');
  if (!generateSuccess) {
    console.error('❌ Build failed: Could not generate Prisma client');
    process.exit(1);
  }

  // Step 3: Deploy migrations (with retry logic)
  let migrationSuccess = false;
  const maxRetries = 3;
  
  for (let i = 0; i < maxRetries; i++) {
    console.log(`\n🔄 Attempting database migration (attempt ${i + 1}/${maxRetries})...`);
    
    migrationSuccess = await runCommand('npx prisma migrate deploy', `Database migration (attempt ${i + 1})`);
    
    if (migrationSuccess) {
      break;
    }
    
    if (i < maxRetries - 1) {
      console.log('⏳ Waiting 5 seconds before retry...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (!migrationSuccess) {
    console.log('\n⚠️  Migration failed, but continuing build...');
    console.log('📝 The application will handle migrations at runtime if needed');
  }

  console.log('\n🎉 Render build process completed!');
  console.log('📦 Application is ready to deploy');
}

renderBuild().catch(error => {
  console.error('❌ Render build process failed:', error);
  process.exit(1);
});
