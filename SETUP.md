# Setup Guide - TES Property System

This guide will help you set up and run the TES Property Real Estate Inquiry Management System on your local machine.

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A text editor (VS Code recommended)
- Internet connection (for Firebase)
- Firebase account (free)

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get the Code

**Option A: Clone from GitHub**
```bash
git clone <repository-url>
cd FINALrepoFORfrontendsimplified.v2
```

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract to your desired location
3. Navigate to the extracted folder

### Step 2: Configure Firebase

See [FIREBASE-SETUP.md](FIREBASE-SETUP.md) for detailed Firebase configuration instructions.

Quick steps:
1. Create Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database
3. Copy configuration from Firebase Console
4. Update `js/firebase-config.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Run the Application

Choose one of the following methods:

#### Method A: VS Code Live Server (Recommended)

1. Open VS Code
2. Install the "Live Server" extension:
   - Click Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Click Install
3. Open the project folder in VS Code
4. Right-click on `index.html`
5. Select "Open with Live Server"
6. Your default browser will open automatically

#### Method B: Python HTTP Server

If you have Python installed:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Then open http://localhost:8000 in your browser.

#### Method C: Node.js HTTP Server

If you have Node.js installed:

```bash
npx http-server
```

Then open http://localhost:8080 in your browser.

#### Method D: PHP Built-in Server

If you have PHP installed:

```bash
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

### Step 4: Initialize Sample Data

1. Navigate to http://localhost:8000 (or your server URL)
2. Click "Login" in the top navigation
3. Log in as admin:
   - **Email:** admin@tesproperty.com
   - **Password:** admin123
4. Open browser developer console (press F12)
5. Type and run: `initializeSampleData()`
6. Wait for the success message
7. Refresh the page

Sample data includes:
- 10 properties (various types and locations)
- 6 agents with different performance levels
- 15 inquiries with various statuses
- 3 calendar events

### Step 5: Explore the System

**As a Customer:**
1. Go to http://localhost:8000
2. Browse properties
3. Click on a property to view details
4. Submit an inquiry

**As an Agent:**
1. Go to http://localhost:8000/shared/login.html
2. Log in with agent credentials (maria@tesproperty.com / agent123)
3. View your dashboard
4. Manage your inquiries

**As an Admin:**
1. Go to http://localhost:8000/shared/login.html
2. Log in with admin credentials (admin@tesproperty.com / admin123)
3. View the admin dashboard
4. Assign inquiries to agents
5. Manage properties

## 🔧 Troubleshooting

### Issue: Firebase Connection Error

**Symptoms:** "Unable to connect to database" message

**Solutions:**
1. Check your internet connection
2. Verify Firebase configuration in `js/firebase-config.js`
3. Ensure Firebase Realtime Database is enabled
4. Check Firebase security rules (see FIREBASE-SETUP.md)

### Issue: CORS Error

**Symptoms:** "CORS policy" error in browser console

**Solutions:**
1. Don't open HTML files directly (file:///)
2. Use a local server (see Step 3 above)
3. If using Chrome, install "Allow CORS" extension (not recommended for production)

### Issue: Sample Data Not Loading

**Symptoms:** Empty property list or no inquiries

**Solutions:**
1. Ensure you ran `initializeSampleData()` in the console
2. Check Firebase console to verify data exists
3. Clear browser cache and reload
4. Check browser console for JavaScript errors

### Issue: Login Not Working

**Symptoms:** Invalid credentials or redirect issues

**Solutions:**
1. Use exact credentials (case-sensitive)
2. Clear browser localStorage: `localStorage.clear()`
3. Refresh the page and try again

### Issue: Real-time Updates Not Working

**Symptoms:** Changes not appearing without refresh

**Solutions:**
1. Check Firebase connection
2. Ensure Firebase listeners are active (check console)
3. Verify you're on the same database across devices
4. Check Firebase security rules allow read/write

### Issue: Mobile Responsive Issues

**Symptoms:** Layout broken on mobile

**Solutions:**
1. Clear browser cache
2. Test in Chrome DevTools mobile view
3. Ensure viewport meta tag is present
4. Check for CSS conflicts

## 🌐 Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Mobile Browsers:**
- ✅ Chrome Mobile
- ✅ Safari Mobile
- ✅ Firefox Mobile

## 📱 Testing on Mobile Devices

### Option 1: Same Network

1. Find your computer's local IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
2. On your mobile device, open browser
3. Navigate to `http://YOUR_IP:8000`

### Option 2: Chrome DevTools

1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select device type (iPhone, iPad, etc.)
4. Test responsiveness

## 🔐 Security Notes for Development

**Important:** This setup is for development only!

For development:
- Firebase is in test mode (public read/write)
- No authentication security
- Hardcoded credentials
- No input sanitization

For production, you MUST:
- Implement proper Firebase security rules
- Add real authentication
- Sanitize all user inputs
- Use HTTPS
- Remove test credentials
- Add rate limiting

## 📊 Performance Tips

1. **Clear Cache:** Regularly clear browser cache during development
2. **Use Latest Browser:** Keep your browser updated
3. **Stable Connection:** Ensure stable internet for Firebase
4. **Close Unused Tabs:** Reduce memory usage
5. **Disable Extensions:** Some extensions may interfere

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check browser console for errors (F12)
2. Review Firebase console for data/rules
3. Verify all files are in correct locations
4. Check that Firebase URLs are correct
5. Try in a different browser
6. Clear all cache and try again

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [JavaScript MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTML MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS)

## ✅ Setup Checklist

- [ ] Code downloaded/cloned
- [ ] Firebase project created
- [ ] Firebase Realtime Database enabled
- [ ] Firebase configuration updated in code
- [ ] Local server running
- [ ] Application accessible in browser
- [ ] Sample data initialized
- [ ] Login working
- [ ] Real-time updates working
- [ ] Mobile responsive tested

---

**Need more help?** Check [FIREBASE-SETUP.md](FIREBASE-SETUP.md) for detailed Firebase instructions.
