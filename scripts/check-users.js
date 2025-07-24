const API_BASE_URL = 'https://navimpact-api.onrender.com';

async function checkUsers() {
  try {
    console.log('🔍 Checking existing users...');
    console.log(`📡 API URL: ${API_BASE_URL}`);
    console.log('');

    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const users = await response.json();
    console.log(`📊 Found ${users.length} users:`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('');
      console.log('💡 You need to create a user first before creating projects.');
      console.log('   The API requires authentication for project creation.');
    } else {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.full_name} (${user.email}) - ID: ${user.id}`);
      });
      console.log('');
      console.log('✅ You can use any of these users to create projects.');
    }
  } catch (error) {
    console.error('❌ Failed to check users:', error.message);
  }
}

checkUsers().catch(console.error); 