const API_BASE_URL = 'https://navimpact-api.onrender.com';

// Try different approaches to create a user
async function tryCreateUser() {
  console.log('🔍 Testing different user creation methods...');
  console.log(`📡 API URL: ${API_BASE_URL}`);
  console.log('');

  const userData = {
    email: "demo@navimpact.com",
    full_name: "Demo User"
  };

  // Method 1: Try register endpoint with form data
  try {
    console.log('1️⃣ Trying register with form data...');
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(userData.email)}&password=any&full_name=${encodeURIComponent(userData.full_name)}`,
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ User created with form data!');
      console.log('Token:', result.access_token);
      return result.access_token;
    } else {
      const errorText = await response.text();
      console.log(`❌ Form data failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Form data error: ${error.message}`);
  }

  // Method 2: Try register endpoint with JSON
  try {
    console.log('2️⃣ Trying register with JSON...');
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ User created with JSON!');
      console.log('Token:', result.access_token);
      return result.access_token;
    } else {
      const errorText = await response.text();
      console.log(`❌ JSON failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ JSON error: ${error.message}`);
  }

  // Method 3: Try users endpoint
  try {
    console.log('3️⃣ Trying users endpoint...');
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ User created with users endpoint!');
      console.log('User ID:', result.id);
      return result;
    } else {
      const errorText = await response.text();
      console.log(`❌ Users endpoint failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Users endpoint error: ${error.message}`);
  }

  // Method 4: Try login with existing user
  try {
    console.log('4️⃣ Trying to login with existing user...');
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(userData.email)}&password=any`,
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Login successful!');
      console.log('Token:', result.access_token);
      return result.access_token;
    } else {
      const errorText = await response.text();
      console.log(`❌ Login failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Login error: ${error.message}`);
  }

  console.log('');
  console.log('❌ All methods failed. The API might not be updated yet.');
  return null;
}

// Run the test
tryCreateUser().catch(console.error); 