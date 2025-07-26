#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// You'll need to replace this with your actual project ID
const PROJECT_ID = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID || 'YOUR_PROJECT_ID';

if (PROJECT_ID === 'YOUR_PROJECT_ID') {
  console.log('❌ Please set your SUPABASE_PROJECT_ID environment variable');
  console.log('   You can find this in your Supabase dashboard under Settings > General');
  process.exit(1);
}

try {
  console.log('🔄 Generating TypeScript types from Supabase...');
  
  // Generate types
  execSync(`npx supabase gen types typescript --project-id ${PROJECT_ID} > types/supabase.ts`, {
    stdio: 'inherit'
  });
  
  console.log('✅ Types generated successfully!');
  console.log('📁 Check types/supabase.ts for your updated schema types');
  
} catch (error) {
  console.error('❌ Error generating types:', error.message);
  console.log('💡 Make sure you have the Supabase CLI installed and your project ID is correct');
  process.exit(1);
} 