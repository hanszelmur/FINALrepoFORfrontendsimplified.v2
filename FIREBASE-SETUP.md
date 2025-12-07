# Firebase Setup Guide

Complete guide to setting up Firebase Realtime Database for TES Property System.

## 🎯 Overview

Firebase Realtime Database provides:
- Real-time data synchronization
- Offline data persistence
- Cross-device sync
- No backend server required

Estimated setup time: **5 minutes**

## 📝 Step-by-Step Setup

### Step 1: Create Firebase Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. If you don't have a Google account, create one first

### Step 2: Create a New Project

1. Click "**Add project**" or "**Create a project**"
2. Enter project name: `tes-property` (or your preferred name)
3. Click "**Continue**"
4. **Google Analytics:** You can disable this for development (optional)
5. Click "**Create project**"
6. Wait for project creation (about 30 seconds)
7. Click "**Continue**" when ready

### Step 3: Enable Realtime Database

1. In the Firebase Console, find your project
2. In the left sidebar, click "**Build**"
3. Click "**Realtime Database**"
4. Click "**Create Database**"
5. **Choose location:** Select closest to your users (e.g., `asia-southeast1` for Philippines)
6. **Security rules:** Select "**Start in test mode**" (for development)
   - ⚠️ **Warning:** Test mode allows public read/write access
   - ✅ Fine for development
   - ❌ NOT for production
7. Click "**Enable**"

Your database is now created with a URL like:
```
https://tes-property-default-rtdb.firebaseio.com/
```

### Step 4: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Select "**Project settings**"
3. Scroll down to "**Your apps**" section
4. Click the **web icon** (`</>`)
5. Register your app:
   - **App nickname:** `TES Property Web`
   - Don't check "Also set up Firebase Hosting"
   - Click "**Register app**"
6. Copy the Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tes-property.firebaseapp.com",
  databaseURL: "https://tes-property-default-rtdb.firebaseio.com",
  projectId: "tes-property",
  storageBucket: "tes-property.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

7. Click "**Continue to console**"

### Step 5: Update Your Code

1. Open `js/firebase-config.js` in your text editor
2. Replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",               // Replace with your actual key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Save the file

### Step 6: Verify Database Structure

After initializing sample data, your Firebase database should have this structure:

```
{
  "properties": {
    "property_1": { ... },
    "property_2": { ... }
  },
  "inquiries": {
    "inquiry_1": { ... },
    "inquiry_2": { ... }
  },
  "users": {
    "user_1": { ... },
    "user_2": { ... }
  },
  "calendar": {
    "event_1": { ... },
    "event_2": { ... }
  }
}
```

## 🔒 Security Rules

### Development Mode (Current)

For development and testing, we use test mode:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning:** This allows anyone to read/write your database!
- ✅ OK for development
- ❌ NEVER use in production

### Production Mode (Recommended)

For production, implement proper security rules:

```json
{
  "rules": {
    "properties": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'"
    },
    "inquiries": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$inquiryId": {
        ".write": "auth != null && (
          root.child('users').child(auth.uid).child('role').val() == 'admin' ||
          (root.child('users').child(auth.uid).child('role').val() == 'agent' &&
           data.child('assignedAgentId').val() == auth.uid)
        )"
      }
    },
    "users": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'"
    },
    "calendar": {
      ".read": "auth != null",
      ".write": "auth != null && (
        root.child('users').child(auth.uid).child('role').val() == 'admin' ||
        (root.child('users').child(auth.uid).child('role').val() == 'agent' &&
         data.child('agentId').val() == auth.uid)
      )"
    }
  }
}
```

**To update rules:**
1. Go to Firebase Console → Realtime Database
2. Click "**Rules**" tab
3. Paste the rules above
4. Click "**Publish**"

## 📊 Database Limits

Firebase Realtime Database (Free Spark Plan):
- **Storage:** 1 GB
- **Simultaneous connections:** 100
- **Downloads:** 10 GB/month

For this project:
- Sample data: ~100 KB
- Expected usage: <1 MB
- More than sufficient for development and small deployments

## 🧪 Testing Your Setup

### Test 1: Check Connection

1. Open your application in a browser
2. Open browser console (F12)
3. Look for: "Firebase initialized successfully"
4. If you see errors, check your configuration

### Test 2: Initialize Sample Data

1. Log in as admin (admin@tesproperty.com / admin123)
2. Open browser console (F12)
3. Run: `initializeSampleData()`
4. You should see: "Sample data initialized successfully!"

### Test 3: Verify in Firebase Console

1. Go to Firebase Console
2. Open Realtime Database
3. You should see data nodes: properties, inquiries, users, calendar
4. Click on each node to expand and view data

### Test 4: Real-time Sync

1. Open application in two browser windows
2. Log in as admin in window 1
3. Log in as agent in window 2
4. In window 1 (admin), assign an inquiry to the agent
5. Window 2 (agent) should show the new inquiry immediately (no refresh needed)

## 🔧 Troubleshooting

### Error: "Permission denied"

**Cause:** Security rules too restrictive

**Solution:**
1. Go to Firebase Console → Realtime Database → Rules
2. Temporarily use test mode rules (see above)
3. Click "Publish"

### Error: "Failed to get document"

**Cause:** Wrong database URL

**Solution:**
1. Check `databaseURL` in `firebase-config.js`
2. It should match your Firebase Console URL exactly
3. Include `https://` and `-default-rtdb.firebaseio.com`

### Error: "Firebase not defined"

**Cause:** Firebase scripts not loaded

**Solution:**
1. Check that Firebase CDN scripts are in your HTML:
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
```
2. Ensure they load before your custom scripts

### Issue: Data not appearing

**Cause:** Database not initialized

**Solution:**
1. Run `initializeSampleData()` in console
2. Check Firebase Console to verify data exists
3. Refresh your application

### Issue: Slow loading

**Cause:** Large dataset or slow connection

**Solution:**
1. Use database indexes for better performance
2. Limit query results with `.limitToFirst()` or `.limitToLast()`
3. Consider data pagination

## 🚀 Performance Optimization

### 1. Use Indexes

In Firebase Console → Realtime Database → Rules, add indexes:

```json
{
  "rules": {
    "inquiries": {
      ".indexOn": ["status", "assignedAgentId", "propertyId", "createdAt"]
    },
    "properties": {
      ".indexOn": ["status", "propertyType", "price"]
    }
  }
}
```

### 2. Limit Data Transfer

Instead of:
```javascript
ref.on('value', callback); // Gets all data
```

Use:
```javascript
ref.limitToLast(50).on('value', callback); // Gets last 50 items
```

### 3. Use Offline Persistence

Firebase automatically caches data locally:
```javascript
firebase.database().goOffline(); // Test offline mode
firebase.database().goOnline();  // Back online
```

## 📚 Additional Resources

- [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Limits](https://firebase.google.com/docs/database/usage/limits)

## ✅ Setup Verification Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Database URL copied
- [ ] Firebase configuration updated in code
- [ ] Security rules set (test mode for development)
- [ ] Firebase SDK scripts included in HTML
- [ ] Console shows "Firebase initialized successfully"
- [ ] Sample data initialized
- [ ] Data visible in Firebase Console
- [ ] Real-time sync working across devices

## 🆘 Need Help?

If you're stuck:
1. Check browser console for errors (F12)
2. Verify all steps were completed
3. Review Firebase Console for warnings
4. Try a different browser
5. Check [Firebase Status](https://status.firebase.google.com/) for service issues

---

**Security Reminder:** Always use proper authentication and security rules in production!
