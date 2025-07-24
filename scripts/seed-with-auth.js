const API_BASE_URL = 'https://navimpact-api.onrender.com';

// User data for seeding
const userData = {
  email: "demo@navimpact.com",
  full_name: "Demo User",
  password: "demo123456"
};

const sampleProjects = [
  {
    name: "Community Health Initiative",
    description: "A comprehensive health program targeting underserved communities with mobile clinics and health education workshops.",
    status: "active",
    start_date: "2024-01-15",
    end_date: "2024-12-31",
    budget: "75000",
    budget_currency: "AUD"
  },
  {
    name: "Youth Education Program",
    description: "After-school tutoring and mentorship program for at-risk youth in urban areas.",
    status: "planning",
    start_date: "2024-03-01",
    end_date: "2024-11-30",
    budget: "45000",
    budget_currency: "AUD"
  },
  {
    name: "Environmental Conservation Project",
    description: "Local ecosystem restoration and community awareness campaign for coastal preservation.",
    status: "active",
    start_date: "2024-02-01",
    end_date: "2024-08-31",
    budget: "60000",
    budget_currency: "AUD"
  },
  {
    name: "Digital Literacy Workshop",
    description: "Computer skills training for seniors and low-income families to bridge the digital divide.",
    status: "completed",
    start_date: "2023-09-01",
    end_date: "2024-01-31",
    budget: "30000",
    budget_currency: "AUD"
  },
  {
    name: "Food Security Initiative",
    description: "Community garden development and sustainable agriculture training for local families.",
    status: "on-hold",
    start_date: "2024-04-01",
    end_date: "2024-10-31",
    budget: "55000",
    budget_currency: "AUD"
  }
];

async function registerUser(userData) {
  try {
    console.log('👤 Registering user...');
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ User registered successfully: ${userData.email}`);
    return result.access_token;
  } catch (error) {
    console.error(`❌ Failed to register user "${userData.email}":`, error.message);
    throw error;
  }
}

async function loginUser(userData) {
  try {
    console.log('🔐 Logging in user...');
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(userData.email)}&password=${encodeURIComponent(userData.password)}`,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ User logged in successfully`);
    return result.access_token;
  } catch (error) {
    console.error(`❌ Failed to login user:`, error.message);
    throw error;
  }
}

async function createProject(projectData, authToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Created project: ${projectData.name}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create project "${projectData.name}":`, error.message);
    throw error;
  }
}

async function seedWithAuth() {
  console.log('🌱 Starting authenticated seeding...');
  console.log(`📡 API URL: ${API_BASE_URL}`);
  console.log('');

  try {
    let authToken;
    
    // Try to register first, if it fails, try to login
    try {
      authToken = await registerUser(userData);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('👤 User already exists, trying to login...');
        authToken = await loginUser(userData);
      } else {
        throw error;
      }
    }
    
    // Create projects with authentication
    let successCount = 0;
    let errorCount = 0;

    for (const project of sampleProjects) {
      try {
        await createProject(project, authToken);
        successCount++;
        // Add a small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        errorCount++;
      }
    }

    console.log('');
    console.log('📊 Seeding Summary:');
    console.log(`✅ Successful projects: ${successCount}`);
    console.log(`❌ Failed projects: ${errorCount}`);
    console.log(`📝 Total attempted: ${sampleProjects.length}`);

    if (successCount > 0) {
      console.log('');
      console.log('🎉 Database has been populated with sample data!');
      console.log(`👤 User: ${userData.email}`);
      console.log(`🔑 Password: ${userData.password}`);
      console.log('You can now view the projects in the NavImpact dashboard.');
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

// Run the seeding
seedWithAuth().catch(console.error); 