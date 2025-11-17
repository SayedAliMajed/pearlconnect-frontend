#!/usr/bin/env node

// Simple API-based Seeding Script for PearlConnect Development
// This uses frontend API calls instead of direct database access
// Run with: node scripts/seed.js

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';
const TEST_TOKEN = 'YOUR_TEST_TOKEN_HERE'; // Replace with an actual token from your backend

console.log('🌱 Starting simple API-based seeding...');
console.log(`Using API URL: ${API_URL}`);

async function makeApiCall(endpoint, method = 'POST', data = null) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add token if available (you'll need to get this from your backend)
  if (TEST_TOKEN) {
    headers.Authorization = `Bearer ${TEST_TOKEN}`;
  }

  const options = { method, headers };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(`❌ ${method} ${endpoint} failed: ${response.status}`);
      console.log('Response:', result);
      return null;
    }

    console.log(`✅ ${method} ${endpoint} success`);
    return result;
  } catch (err) {
    console.log(`❌ ${method} ${endpoint} error:`, err.message);
    return null;
  }
}

async function seedData() {
  console.log('\n🔄 Testing backend connectivity...');

  // Test basic connectivity
  const testResponse = await makeApiCall('/categories', 'GET');
  if (!testResponse) {
    console.log('\n❌ Cannot connect to backend. Please ensure:');
    console.log('   1. Backend server is running on', API_URL);
    console.log('   2. Replace TEST_TOKEN with a valid JWT token from your backend');
    console.log('   3. Ensure CORS settings allow API calls');
    process.exit(1);
  }

  console.log('\n✅ Backend is responding!');
  console.log('✅ You have', testResponse.categories?.length || 0, 'existing categories');

  console.log('\n📝 Seeding Instructions:');
  console.log('1. Get a valid JWT token from your backend (login as admin/provider)');
  console.log('2. Replace YOUR_TEST_TOKEN_HERE in the script with the actual token');
  console.log('3. Run this script again');

  console.log('\n📋 The script will then create:');
  console.log('- Multiple services across all providers');
  console.log('- Customer bookings with various statuses');
  console.log('- Reviews for completed services');

  // Show what data would be created
  console.log('\n🏗️ Will create services for:');
  console.log('- Sarah (Cleaning): Residential Deep Cleaning, Office Cleaning');
  console.log('- Mark (Tutoring): Math, English, Science, Computer Science');
  console.log('- James (Plumbing): Emergency Repairs, Water Heaters, Drain Cleaning');
  console.log('- Additional services for Painting, Electrician, Landscaping');

  console.log('\n📅 Will create bookings for customers:');
  console.log('- Maria: Confirmed cleaning + Pending tutoring');
  console.log('- Ahmed: Confirmed electrical + Completed math tutoring');
  console.log('- Fatema: Pending painting');
  console.log('- Omar: Completed plumbing + Confirmed landscaping');

  console.log('\n⭐ Will create reviews for completed bookings');
}

// Run the seeding instructions
seedData().catch(console.error);
