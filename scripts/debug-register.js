const API_BASE_URL = 'https://navimpact-api.onrender.com';

async function debugRegister() {
  console.log('🔍 Debugging register endpoint...');
  
  const userData = {
    email: "debug@navimpact.com",
    full_name: "Debug User"
  };

  try {
    console.log('📤 Sending request...');
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(userData.email)}&password=any&full_name=${encodeURIComponent(userData.full_name)}`,
    });

    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`📥 Response body: ${responseText}`);
    
    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ Parsed JSON response:', result);
      } catch (e) {
        console.log('❌ Could not parse as JSON');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugRegister().catch(console.error); 