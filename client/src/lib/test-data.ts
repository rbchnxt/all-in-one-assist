// Test credentials and sample data for EduVoice
import { authService } from './auth';
import { databaseService } from './database';

export const testCredentials = [
  {
    email: 'student1@test.com',
    password: 'test123',
    name: 'Alex Johnson',
    profile: {
      firstName: 'Alex',
      lastName: 'Johnson',
      dateOfBirth: '2008-03-15',
      school: 'Roosevelt High School',
      address: '123 Oak Street',
      city: 'Springfield',
      state: 'Illinois',
      zipCode: '62701',
      country: 'United States',
      grade: '10',
      parentName: 'Sarah Johnson',
      parentEmail: 'sarah.johnson@email.com',
      parentPhone: '(555) 123-4567',
      language: 'en',
      timezone: 'America/Chicago',
    }
  },
  {
    email: 'student2@test.com',
    password: 'test123',  
    name: 'Maria Garcia',
    profile: {
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: '2007-09-22',
      school: 'Lincoln Middle School',
      address: '456 Elm Avenue',
      city: 'Phoenix',
      state: 'Arizona',
      zipCode: '85001',
      country: 'United States',
      grade: '8',
      parentName: 'Carlos Garcia',
      parentEmail: 'carlos.garcia@email.com',
      parentPhone: '(555) 987-6543',
      language: 'es',
      timezone: 'America/Phoenix',
    }
  },
  {
    email: 'student3@test.com',
    password: 'test123',
    name: 'James Chen',
    profile: {
      firstName: 'James',
      lastName: 'Chen',
      dateOfBirth: '2005-11-08',
      school: 'University of California Berkeley',
      address: '789 University Ave',
      city: 'Berkeley',
      state: 'California', 
      zipCode: '94720',
      country: 'United States',
      grade: 'college-sophomore',
      parentName: 'Wei Chen',
      parentEmail: 'wei.chen@email.com',
      parentPhone: '(555) 555-0123',
      language: 'en',
      timezone: 'America/Los_Angeles',
    }
  }
];

export const sampleQuestions = [
  {
    question: "What is photosynthesis and how does it work?",
    answer: "Photosynthesis is the process by which plants convert light energy from the sun into chemical energy in the form of glucose. It occurs in the chloroplasts of plant cells and involves two main stages: the light-dependent reactions and the Calvin cycle. During photosynthesis, plants take in carbon dioxide from the air and water from the soil, and using sunlight, they produce glucose and oxygen. The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2."
  },
  {
    question: "Explain the water cycle",
    answer: "The water cycle is the continuous movement of water through Earth's atmosphere, land, and oceans. It consists of several key processes: 1) Evaporation - water changes from liquid to vapor, 2) Transpiration - plants release water vapor, 3) Condensation - water vapor forms clouds, 4) Precipitation - water falls as rain or snow, 5) Collection - water gathers in bodies of water and groundwater. This cycle is powered by solar energy and gravity, and it's essential for distributing fresh water across the planet."
  },
  {
    question: "What causes earthquakes?",
    answer: "Earthquakes are caused by the sudden release of energy that has been stored in the Earth's crust. This typically happens when tectonic plates move against each other along fault lines. The Earth's outer layer consists of several large plates that are constantly moving very slowly. When these plates get stuck at their edges due to friction, stress builds up. When the stress becomes too great, the plates suddenly slip, releasing energy in the form of seismic waves that we feel as earthquakes. Most earthquakes occur at plate boundaries, particularly along the 'Ring of Fire' around the Pacific Ocean."
  }
];

// Function to create test accounts and data
export async function createTestData() {
  console.log('Creating test credentials and sample data...');
  
  // Create test user accounts
  for (const testUser of testCredentials) {
    try {
      // Store credentials
      localStorage.setItem(`eduvoice_credentials_${testUser.email}`, JSON.stringify({
        id: authService['generateUserId'](testUser.email),
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
        authProvider: 'native'
      }));

      // Create student profile  
      const userId = authService['generateUserId'](testUser.email);
      await databaseService.createStudent({
        userId,
        email: testUser.email,
        ...testUser.profile
      });

      // Add sample questions
      const student = await databaseService.getStudent(userId);
      if (student) {
        for (let i = 0; i < sampleQuestions.length; i++) {
          await databaseService.saveQuestion({
            studentId: student.id,
            question: sampleQuestions[i].question,
            answer: sampleQuestions[i].answer,
            language: student.language
          });
        }
      }

      console.log(`✓ Created test account: ${testUser.email}`);
    } catch (error) {
      console.log(`Account ${testUser.email} already exists or error occurred:`, error);
    }
  }
  
  console.log('Test data creation complete!');
  console.log('\nTest Accounts:');
  testCredentials.forEach(cred => {
    console.log(`Email: ${cred.email} | Password: ${cred.password} | Name: ${cred.name}`);
  });
}

// Auto-create test data on first load
if (typeof window !== 'undefined' && !localStorage.getItem('eduvoice_test_data_created')) {
  createTestData().then(() => {
    localStorage.setItem('eduvoice_test_data_created', 'true');
  });
}