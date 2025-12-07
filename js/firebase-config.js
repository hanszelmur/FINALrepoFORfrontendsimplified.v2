// Firebase Configuration
// Replace with your Firebase project credentials

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
