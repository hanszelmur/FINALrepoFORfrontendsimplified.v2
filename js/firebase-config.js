// Firebase Configuration
// ⚠️ IMPORTANT: Replace with your Firebase project credentials before deployment
// See FIREBASE-SETUP.md for detailed setup instructions

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                                   // ⚠️ Replace with actual API key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",           // ⚠️ Replace with actual project ID
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",  // ⚠️ Replace with actual database URL
  projectId: "YOUR_PROJECT_ID",                            // ⚠️ Replace with actual project ID
  storageBucket: "YOUR_PROJECT_ID.appspot.com",           // ⚠️ Replace with actual project ID
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",          // ⚠️ Replace with actual sender ID
  appId: "YOUR_APP_ID"                                    // ⚠️ Replace with actual app ID
};

// Initialize Firebase
let database;

function initializeFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded. Please include Firebase scripts.');
      return false;
    }
    
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
}

// Database References
function getPropertiesRef() {
  return database.ref('properties');
}

function getInquiriesRef() {
  return database.ref('inquiries');
}

function getUsersRef() {
  return database.ref('users');
}

function getCalendarRef() {
  return database.ref('calendar');
}

// Helper function to get a new key
function getNewKey(ref) {
  return database.ref(ref).push().key;
}
