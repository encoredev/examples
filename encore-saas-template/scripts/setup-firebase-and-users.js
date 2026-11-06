const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const { spawn } = require('child_process');
const pg = require('pg');
const { GoogleAuth } = require("google-auth-library");
const minimist = require("minimist");

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const execAsync = promisify(exec);

async function runInsertCommand(insertStatement, tableName) {
  // find docker port with docker ps --format "{{.Names}} {{.Ports}}"
  const dockerPort = await execAsync('docker ps --format "{{.Names}} {{.Ports}}"');
  // Count lines
  const lines = dockerPort.stdout.trim().split('\n');
  if (lines.length === 0) {
    throw new Error('No docker containers found');
  } else if (lines.length > 1) {
    throw new Error('Multiple docker containers found');
  }

  const port = dockerPort.stdout.split(' ')[1].split(':')[1].split('-')[0];
  const client = new pg.Client({
      connectionString: `postgres://postgres:postgres@localhost:${port}/${tableName}`,
  });

  await client.connect();
  await client.query(
      insertStatement
  );
  await client.end();
}

// Function to validate and load service account
function loadServiceAccount(filePath) {
  try {
   
    // Resolve path (handle relative and absolute paths)
    const resolvedPath = path.resolve(filePath);
    console.log("Resolved path:", resolvedPath);
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Service account file not found at: ${resolvedPath}`);
    }

    // Read and parse the file
    const fileContent = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

    // Validate that it's a service account file
    if (fileContent.type !== 'service_account') {
      throw new Error('Invalid service account file. File must contain "type": "service_account"');
    }

    console.log(`✅ Successfully loaded service account from: ${resolvedPath}`);
    return resolvedPath;

  } catch (error) {
    console.error('❌ Error loading service account:', error.message);
    console.log('\nPlease ensure you provide a valid service account JSON file path.');
    console.log('Example usage: npm run seed-users -- --service-account=./firebase-service-account.json\n');
    process.exit(1);
  }
}

// Test users data
const users = [
  {
    id: 'be101637-cbca-4467-b3f7-eb5ccdc6846f',
    email: 'test@example.com',
    password: 'testpassword123',
    displayName: 'Test User',
    role: 'user',
    metadata: {
      createdAt: new Date().toISOString()
    }
  },
  {
    id: '34a558f2-790f-427b-9d42-bd746e953c23',
    email: 'admin@example.com',
    password: 'adminpassword123',
    displayName: 'Admin User',
    role: 'admin',
    metadata: {
      createdAt: new Date().toISOString()
    }
  }
  // Add more test users as needed
];

async function seedUsers(serviceAccountPath) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
      });
    }

    let insertStatement = `INSERT INTO users (id, email, display_name, external_id) 
              VALUES ('${users[0].id}', '${users[0].email}', '${users[0].displayName}', '$testExternalId'),
             ('${users[1].id}', '${users[1].email}', '${users[1].displayName}', '$adminExternalId');
    `;
    let testExternalId = '';
    let adminExternalId = '';

    console.log('🌱 Starting user seeding...');

    for (const userData of users) {
      try {
        // Check if user already exists
        try {
          const userRecord = await admin.auth().getUserByEmail(userData.email);
          console.log(`User ${userData.email} already exists, updating...`);
          
          // Update existing user
          await admin.auth().updateUser(userRecord.uid, {
            displayName: userData.displayName,
            password: userData.password
          });

          // Update custom claims
          await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: userData.role
          });

          console.log(`✅ Updated user in firebase: ${userData.email}`);
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            // Create new user in Firebase
            const userRecord = await admin.auth().createUser({
              email: userData.email,
              password: userData.password,
              displayName: userData.displayName,
              emailVerified: true // For testing convenience
            });

            // Set custom claims (roles)
            await admin.auth().setCustomUserClaims(userRecord.uid, {
              role: userData.role
            });
    
            console.log(`✅ Created new user in firebase: ${userData.email}`);
            
            if (userData.email === 'test@example.com') {
              testExternalId = userRecord.uid;
            } else if (userData.email === 'admin@example.com') {
              adminExternalId = userRecord.uid;
            }
            
          } else {
            throw error;
          }
        }

      } catch (error) {
        console.error(`❌ Error processing user ${userData.email}:`, error);
      }
    }
    console.log('✅ Users created in firebase!');
    insertStatement = insertStatement.replace('$testExternalId', testExternalId).replace('$adminExternalId', adminExternalId);
    runInsertCommand(insertStatement, 'users').catch(console.error);
    console.log('✅ Users created in postgres!');

    console.log('✅ Users seeding completed!');


    // Put in some activity logs as well
    runInsertCommand(`
        INSERT INTO activities (id, user_id, event, created_at)
        VALUES (gen_random_uuid(), '${users[0].id}', 'signup', NOW()),
              (gen_random_uuid(), '${users[1].id}', 'signup', NOW());
      `, 'activities').catch(console.error);

    // set service-account.json in encore secrets
    await execAsync(`encore secret set --type local,dev FirebasePrivateKey < "${serviceAccountPath}"`);
    

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Clean up admin app
    await admin.app().delete();
  }
}

// Helper function to delete all users (use with caution!)
async function deleteAllUsers(serviceAccountPath) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
      });
    }

    console.log('🗑️ Deleting all existing users...');
    
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;

    for (const userRecord of users) {
      await admin.auth().deleteUser(userRecord.uid);
      console.log(`Deleted user: ${userRecord.email}`);
    }

    // Run encore db reset users
    await execAsync('encore db reset users');
    await execAsync('encore db reset activities');
    await execAsync('encore db reset subscriptions');

    console.log('✅ All users deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting users:', error);
    process.exit(1);
  }
}

// Use Google Auth Library to get a valid OAuth2 token
async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  if (!tokenResponse) {
    throw new Error("Failed to obtain access token");
  }

  return tokenResponse.token;
}

// Fetch Firebase config using the correct authentication token
async function fetchFirebaseConfig() {
  const projectId = serviceAccount.project_id;
  const apiUrl = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/-/config`;

  try {
    const token = await getAccessToken(); // Get OAuth token

    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Firebase config: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Failed to fetch Firebase config:", error);
    process.exit(1);
  }
}

async function saveToEnvFile() {
  const config = await fetchFirebaseConfig();
  const envPath = path.resolve(process.cwd(), "frontend/.env.local");

  const envContent = `
NEXT_PUBLIC_FIREBASE_API_KEY=${config.apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${config.projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${config.appId}
NEXT_PUBLIC_API_URL=http://127.0.0.1:4000
NEXT_PUBLIC_ENVIRONMENT=local
  `.trim();

  fs.writeFileSync(envPath, envContent, { encoding: "utf8" });
  console.log("✅ Firebase config saved to .env.local");
}



const args = minimist(process.argv.slice(2));
const serviceAccountPath = loadServiceAccount(args["service-account"]);

// Read and parse the service account JSON file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
saveToEnvFile();


if (args['delete-all']) {
  deleteAllUsers(serviceAccountPath);
} else {
  seedUsers(serviceAccountPath);
} 

