const https = require('https');

// Simple test script to work with current API
async function testAuth() {
  console.log('🔍 Testing NavImpact API Authentication...\n');
  
  // Test 1: Check API health
  console.log('1. Checking API health...');
  try {
    const healthResponse = await makeRequest('GET', '/health');
    console.log('✅ API Health:', healthResponse.status);
  } catch (error) {
    console.log('❌ API Health failed:', error.message);
  }
  
  // Test 2: Try to register with current API format
  console.log('\n2. Testing user registration...');
  try {
    const formData = new URLSearchParams();
    formData.append('username', 'test@example.com');
    formData.append('password', 'dummy'); // Required by current API
    formData.append('full_name', 'Test User');
    formData.append('organisation', 'Test Org');
    
    const registerResponse = await makeRequest('POST', '/api/v1/auth/register', formData.toString());
    console.log('✅ Registration successful:', registerResponse);
    
    // Test 3: Try to login
    console.log('\n3. Testing user login...');
    const loginFormData = new URLSearchParams();
    loginFormData.append('username', 'test@example.com');
    loginFormData.append('password', 'dummy');
    
    const loginResponse = await makeRequest('POST', '/api/v1/auth/login', loginFormData.toString());
    console.log('✅ Login successful:', loginResponse);
    
  } catch (error) {
    console.log('❌ Registration/Login failed:', error.message);
  }
  
  // Test 4: Check users endpoint
  console.log('\n4. Checking users endpoint...');
  try {
    const usersResponse = await makeRequest('GET', '/api/v1/users/');
    console.log('✅ Users endpoint:', usersResponse.length, 'users found');
  } catch (error) {
    console.log('❌ Users endpoint failed:', error.message);
  }
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'navimpact-api.onrender.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || parsed.detail || responseData}`));
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Run the test
testAuth().catch(console.error); 