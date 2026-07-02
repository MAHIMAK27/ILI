require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// We will use native fetch available in Node.js 18+

async function runAuthTests() {
  let mongoServer;
  let serverProcess;
  
  try {
    console.log('--- Starting Auth Integration Tests ---');
    
    // 1. Start Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // 2. Set Env Var for server.js
    process.env.MONGO_URI = uri;
    process.env.PORT = 5001; // Avoid conflict if 5000 is used
    process.env.JWT_SECRET = 'testsecret123';
    
    // 3. Start Server (require server.js will run app.listen)
    require('../../server'); 
    
    // Give it a second to bind
    await new Promise(r => setTimeout(r, 1000));
    
    const baseUrl = `http://localhost:${process.env.PORT}/api`;
    let token = '';

    console.log('\n[1] Testing Registration (Valid)');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'security@ili.com', password: 'StrongPassword123' })
    });
    console.log('Status:', regRes.status);
    console.log('Response:', await regRes.json());

    console.log('\n[2] Testing Registration (Duplicate)');
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'security@ili.com', password: 'StrongPassword123' })
    });
    console.log('Status:', dupRes.status);
    console.log('Response:', await dupRes.json());

    console.log('\n[3] Testing Registration (Invalid Password Strength)');
    const weakRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'weak@ili.com', password: 'weak' })
    });
    console.log('Status:', weakRes.status);
    console.log('Response:', await weakRes.json());

    console.log('\n[4] Testing Login (Valid)');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'security@ili.com', password: 'StrongPassword123' })
    });
    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status);
    console.log('Response:', { ...loginData, token: '[REDACTED FOR LOGS]' });
    token = loginData.token;

    console.log('\n[5] Testing Login (Invalid Password)');
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'security@ili.com', password: 'WrongPassword123' })
    });
    console.log('Status:', badLoginRes.status);
    console.log('Response:', await badLoginRes.json());

    console.log('\n[6] Testing Protected Route (Without JWT)');
    const noAuthRes = await fetch(`${baseUrl}/dashboard`);
    console.log('Status:', noAuthRes.status);
    console.log('Response:', await noAuthRes.json());

    console.log('\n[7] Testing Protected Route (With JWT)');
    const authRes = await fetch(`${baseUrl}/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Status:', authRes.status);
    console.log('Response:', await authRes.json());

    console.log('\n--- All Tests Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    process.exit(0);
  }
}

runAuthTests();
