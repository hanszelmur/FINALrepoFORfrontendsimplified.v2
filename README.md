# 🏠 TES Property System v2 - Real Estate Inquiry Management

A complete frontend-only real estate management system with JSON file storage, comprehensive validations, and progressive web app capabilities.

## 📋 Table of Contents

- [What's New in v2](#whats-new-in-v2)
- [What's Removed](#whats-removed)
- [System Logic for AI Assistants](#system-logic-for-ai-assistants)
- [Data Storage Structure](#data-storage-structure)
- [How to Add New Agent](#how-to-add-new-agent)
- [Quick Start](#quick-start)
- [Features](#features)
- [Known Limitations](#known-limitations)
- [Tech Stack](#tech-stack)

---

## 🆕 What's New in v2

### All 27 Issues Fixed

#### Core Functionality (Issues 3-11)
1. **Issue 3 - Photo Upload**: Base64 image compression with browser-image-compression library. Upload up to 10 photos (2MB each), with preview, caption, reorder, and delete capabilities.

2. **Issue 4 - Optimized Auto-Refresh**: Uses Page Visibility API to only refresh when page is active. Manual refresh button included. Shows last refresh timestamp.

3. **Issue 5 - Duplicate Detection**: Normalizes phone numbers (0917/+63/09 formats) and checks for existing inquiries by email OR phone for the same property to prevent duplicates.

4. **Issue 6 - Joi Validation**: All forms validated using Joi schemas. Email regex, Philippine phone format (0917-123-4567), price range (₱100k-₱999M).

5. **Issue 7 - Error Handling**: Try-catch blocks in all operations. QuotaExceededError handling for localStorage. Global error listeners for unhandled rejections.

6. **Issue 8 - Calendar Conflicts**: 30-minute buffer between viewings. Checks agent availability. Shows conflicting events before scheduling.

7. **Issue 9 - Expiry Warnings**: Daily check for expiring reservations. Warns 2 days before expiry. Dashboard alerts for urgent items.

8. **Issue 10 - Loading States**: Spinner buttons during async operations. Skeleton loaders for content loading. Prepared for async server calls.

9. **Issue 11 - Editable Commission**: When marking property as sold, admin can edit sale price and commission amount for accurate record-keeping.

#### Data Management (Issues 12-17)
10. **Issue 12 - Calculated Agent Stats**: Removed stored counters. All agent statistics calculated from inquiry data in real-time for accuracy.

11. **Issue 13 - Reservation Type**: Added 'fee' (non-refundable) or 'deposit' (refundable) selection when marking property as reserved.

12. **Issue 14 - Race Condition TODOs**: Code comments added for future multi-admin optimistic locking with version fields. Current limitation documented.

13. **Issue 15 - Timezone Support**: All dates stored in ISO format. Display in Asia/Manila timezone with helper functions.

14. **Issue 16 - Memory Leak Prevention**: Cleanup intervals on component unmount. beforeunload event cleanup for timers and subscriptions.

15. **Issue 17 - Pagination**: 20 items per page with smooth navigation. Previous/Next buttons and page numbers.

#### Performance & Accessibility (Issues 18-23)
16. **Issue 18 - Lazy Loading**: All images use `loading="lazy"` attribute. Placeholder images for failed loads.

17. **Issue 19 - Optimized Rendering**: Updates specific DOM elements only instead of full re-renders. Uses data attributes for targeted updates.

18. **Issue 20 - Keyboard Navigation**: Proper tabindex order. Logical focus flow. Visible focus indicators on all interactive elements.

19. **Issue 21 - ARIA Labels**: Complete ARIA labels on all interactive elements. `role="alert"` for messages. `aria-live` regions for dynamic content.

20. **Issue 22 - Status Icons**: SVG icons with color coding for all statuses. Both icon and color used for accessibility (not relying on color alone).

21. **Issue 23 - Touch Targets**: All interactive elements minimum 44x44px. Adequate padding on mobile devices.

#### PWA & Security (Issues 24-29)
22. **Issue 24 - PWA Manifest**: Complete manifest.json with all icons (72px to 512px). App shortcuts for Properties and Dashboard. Screenshots for app stores.

23. **Issue 25 - Service Worker**: Functional service worker (sw.js) with cache-first strategy for assets, network-first for pages. Offline support. Background sync ready.

24. **Issue 26 - Bundle Optimization**: Code splitting by feature. Vendor chunks separated (Alpine.js, Joi, DOMPurify, etc.). Tree shaking enabled.

25. **Issue 27 - iOS Zoom Fix**: All input fields use minimum 16px font-size to prevent iOS auto-zoom on focus.

26. **Issue 28 - Rate Limiting**: Client-side rate limiting (3 attempts per minute per email) to prevent inquiry spam.

27. **Issue 29 - XSS Prevention**: All `.innerHTML` audited and replaced with `.textContent` or DOMPurify sanitization. Input sanitization functions.

### 8 New Features Added

1. **Search Functionality**: Search properties by name, address, price range, type, and status with instant results.

2. **Bulk Operations**: Select multiple inquiries and perform bulk actions (assign agent, update status, cancel) for efficiency.

3. **Export to PDF**: Generate PDF reports for property details with photos and inquiry summaries using jsPDF library.

4. **Import CSV**: Upload CSV file with property data. Validation, preview before import, and error reporting.

5. **Agent Performance Reports**: Dashboard with agent statistics, conversion rates, and charts. Export to CSV/PDF.

6. **Property Analytics**: Track most viewed properties, inquiry conversion rates, and trend charts over time.

7. **Search History**: Track popular search terms and property views. Admin insights into customer preferences.

8. **Activity Log Viewer**: Complete audit trail of all system actions with timestamps and descriptions for transparency.

---

## 🔄 What's Removed

### Replaced Technologies

- **Firebase Realtime Database** → **JSON File Storage**
  - Data now stored in `/data` directory as JSON files
  - Simple backend server (server.js) serves and updates files
  - Can easily migrate to any database later

- **Firebase Authentication** → **Hardcoded Login (Demo)**
  - Test accounts pre-configured in `data/users.json`
  - No real authentication for MVP simplicity
  - Production would use proper auth system

- **Real-time Sync** → **Auto-refresh Every 30 Seconds**
  - Page Visibility API prevents refresh when tab hidden
  - Manual refresh button for instant updates
  - Reduces unnecessary network requests

### Why These Changes?

1. **Simplicity**: JSON files are easier to understand and debug than Firebase
2. **Portability**: Data files can be backed up, version controlled, and migrated easily
3. **No Vendor Lock-in**: Not dependent on Firebase pricing or availability
4. **Learning**: Easier for developers to understand the system
5. **Cost**: $0 for hosting (can use any simple file server)

---

## 🤖 System Logic for AI Assistants

### Complete Workflow Explanation

#### 1. Customer Views Properties
- Customer visits homepage
- Properties filtered by status: **Available** (can inquire), **Reserved** (shown but can't inquire), **Pending/Sold** (hidden from listing)
- Each property shows: name, price, location, photos, features
- Click "View Details" to see full property information

#### 2. Customer Submits Inquiry
- Customer fills inquiry form: name, email, phone, address, message
- **Duplicate Check**: System checks if customer (same email OR normalized phone) already has an active inquiry for this property
- **Active Inquiry** means: Not Cancelled, Not Successful, Not "Viewed - Not Interested"
- If duplicate found → Show error message with existing inquiry details
- If rate limited (>3 attempts/minute) → Show error with countdown
- **Validation**: Joi schema validates all fields
  - Email format: name@domain.com
  - Phone format: 0917-123-4567 or +63917-123-4567
  - Name, address minimum lengths
- On success → Inquiry created with status **"New"**
- Added to both `inquiries.json` and `new-inquiries.json`

#### 3. Admin Receives Inquiry
- Admin dashboard shows **unassigned inquiries count** badge
- Admin navigates to Inquiries page
- Filter by status: **New** inquiries appear first
- Admin sees: customer name, property, date submitted, phone/email

#### 4. Admin Assigns to Agent
- Admin clicks "Assign Agent" on inquiry
- Modal shows all active agents with workload info
- **Workload Warning**: If agent has 20+ inquiries, shows yellow warning
- System checks: Can't assign **Deposit Paid** or **Successful** inquiries
- On assignment:
  - Inquiry status changes to **"Assigned"**
  - Agent ID and name stored in inquiry
  - Inquiry removed from `new-inquiries.json`
  - Activity log records assignment

#### 5. Agent Contacts Customer
- Agent logs in to agent portal
- Dashboard shows **assigned inquiries**
- Agent sees customer phone and email
- Agent calls/emails customer to discuss property
- Agent can add notes to inquiry

#### 6. Agent Schedules Viewing
- Agent clicks "Schedule Viewing" on inquiry
- Calendar opens showing agent's schedule
- **Conflict Detection**: System checks for:
  - Same time slot already booked
  - Events within 30 minutes (buffer time)
  - Agent marked as unavailable
- If conflict found → Shows warning with conflicting events
- Agent selects date/time, confirms
- Inquiry status changes to **"Viewing Scheduled"**
- Calendar event created in `calendar-events.json`

#### 7. After Viewing, Agent Updates Status
- Agent changes inquiry status to one of:
  - **"Viewed - Interested"**: Customer liked property, wants to proceed
  - **"Viewed - Not Interested"**: Customer declined
  - **"Viewed - Undecided"**: Customer needs more time
  - **"In Progress"**: Customer interested, gathering documents
- Agent adds detailed notes about viewing

#### 8. If Interested, Admin Marks Property Reserved
- Admin goes to Properties page
- Clicks "Mark as Reserved" on property
- Modal shows:
  - Select reservation type: **Fee** (non-refundable) or **Deposit** (refundable)
  - Enter reservation fee amount
  - Select associated inquiry (that resulted in reservation)
  - Enter expiry date (typically 14 days)
- On confirm:
  - Property status → **"Reserved"**
  - Selected inquiry status → **"Deposit Paid"**
  - **All other inquiries for this property** → Auto-cancelled with note
  - Expiry date tracked for warnings
  - Property no longer accepts new inquiries (button hidden on frontend)

#### 9. After 14 Days or Payment, Admin Marks Sold
- If deposit paid and documents completed, admin marks property **"Sold"**
- Modal allows editing:
  - Final sale price (may differ from listing price)
  - Agent commission (may differ from default)
- On confirm:
  - Property status → **"Sold"**
  - Inquiry status → **"Successful"**
  - Sale details recorded
  - Property hidden from customer listing

#### 10. Agent Earns Commission
- Agent portal shows **"My Properties"** page
- Lists all properties where agent has successful sales
- Shows:
  - Property name
  - Sale price
  - Commission amount
  - Date sold
- Agent can see total earnings

### 11 Possible Inquiry Statuses

1. **New** - Initial submission, unassigned
2. **Assigned** - Assigned to agent, pending contact
3. **In Progress** - Agent actively working on it
4. **Waiting - Property Reserved** - Property reserved, inquiry on hold
5. **Viewing Scheduled** - Viewing date set
6. **Viewed - Interested** - Customer interested after viewing
7. **Viewed - Not Interested** - Customer declined after viewing
8. **Viewed - Undecided** - Customer needs more time to decide
9. **Deposit Paid** - Customer paid deposit, property reserved
10. **Successful** - Property sold to this customer
11. **Cancelled** - Inquiry cancelled (by customer, agent, or auto-cancelled)

### Property Status Workflow

```
Available → Reserved → Pending → Sold
                    ↓
                Withdrawn
```

- **Available**: Listed, accepting inquiries
- **Reserved**: Deposit paid, 14-day reservation period
- **Pending**: Documents being processed
- **Sold**: Fully sold and registered
- **Withdrawn**: Removed from sale (owner decision)

---

## 💾 Data Storage Structure

### JSON Files in `/data` Directory

All data stored in JSON format with metadata section:

#### File Structure Example

```json
{
  "_metadata": {
    "description": "Description of contents",
    "section": "Section name",
    "recordCount": 15,
    "lastModified": "2025-12-09T10:30:00Z"
  },
  "data": [
    // Array of records
  ]
}
```

#### Files and Purpose

1. **properties.json** - All properties (initial + newly added)
2. **new-properties.json** - Only newly added properties (easy to see what admin added!)
3. **inquiries.json** - All customer inquiries
4. **new-inquiries.json** - Only new submissions needing admin attention
5. **users.json** - All system users (admin + agents)
6. **new-agents.json** - Only newly added agents (when system admin adds them)
7. **calendar-events.json** - All viewing schedules and agent unavailability
8. **activity-log.json** - Complete audit trail

#### Activity Log Format

Every action logged with clear, descriptive notes:

```json
{
  "timestamp": "2025-12-09T10:30:00Z",
  "action": "ADD_PROPERTY",
  "section": "Properties",
  "note": "Property added via admin portal",
  "details": {
    "propertyName": "New Condo",
    "price": 4500000,
    "addedBy": "admin@tesproperty.com"
  }
}
```

#### Backend Server (server.js)

Simple Express server that:
- Serves JSON files from `data/` folder
- Handles GET/POST/PUT/DELETE requests
- Writes changes to files atomically
- Updates metadata (recordCount, lastModified)
- Logs all actions to activity-log.json
- Runs on port 3000: `node server.js`

---

## 👤 How to Add New Agent (IMPORTANT!)

### NO "Add Agent" Button in Admin Portal

**This is intentional for security.** Agent creation is done by system administrator manually editing JSON files when HR hires new employees.

### Why Manual Addition?

1. **Security**: Prevents unauthorized account creation
2. **HR Integration**: HR department notifies system admin
3. **Verification**: Admin verifies identity before creating account
4. **Audit Trail**: Manual process ensures proper documentation
5. **Best Practice**: Production systems also restrict user creation to admins

### Steps When Company Hires New Agent

#### Step 1: Open `data/users.json`

```bash
# On server or local development
nano data/users.json
# or use any text editor
```

#### Step 2: Add New Entry to `data` Array

```json
{
  "id": 8,
  "name": "New Agent Name",
  "email": "newagent@tesproperty.com",
  "password": "agent123",
  "role": "agent",
  "phone": "0917-777-7777",
  "active": true,
  "createdAt": "2025-12-09T10:00:00Z"
}
```

**Important**: 
- Use next available ID number
- Email must be unique
- Phone format: 0917-XXX-XXXX
- Set `active: true` for immediate access
- Use ISO date format for `createdAt`

#### Step 3: Add to `data/new-agents.json` for Tracking

```json
{
  "id": 8,
  "name": "New Agent Name",
  "email": "newagent@tesproperty.com",
  "password": "agent123",
  "role": "agent",
  "phone": "0917-777-7777",
  "active": true,
  "createdAt": "2025-12-09T10:00:00Z"
}
```

This helps track agents added after deployment.

#### Step 4: Add Activity Log Entry

Add to `data/activity-log.json`:

```json
{
  "timestamp": "2025-12-09T10:00:00Z",
  "action": "ADD_AGENT",
  "section": "Users",
  "note": "New agent added by system administrator",
  "details": {
    "agentName": "New Agent Name",
    "email": "newagent@tesproperty.com",
    "addedBy": "System Admin"
  }
}
```

#### Step 5: Update Metadata

Update `_metadata.recordCount` in both `users.json` and `new-agents.json`.

#### Step 6: Notify New Agent

Send email to new agent with:
- Login URL
- Email (username)
- Temporary password
- Instructions to change password on first login (future feature)

### Deactivating an Agent

To deactivate (not delete):

```json
{
  "id": 5,
  "name": "Former Agent",
  "email": "former@tesproperty.com",
  "password": "agent123",
  "role": "agent",
  "phone": "0917-444-4444",
  "active": false,  // Changed to false
  "createdAt": "2025-01-01T00:00:00Z"
}
```

Deactivated agents:
- Cannot log in
- Data preserved for historical records
- Inquiries remain assigned (shows as inactive agent)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for development and server)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd FINALrepoFORfrontendsimplified.v2

# Install dependencies
npm install
```

### Development Mode

#### Option 1: Frontend Only (Uses localStorage)

```bash
# Start Vite dev server
npm run dev

# Open browser to http://localhost:5173
```

#### Option 2: With Backend Server

```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Start frontend dev server
npm run dev

# Or run both together
npm run dev:full
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to any static host
```

### Test Accounts

#### Admin
- Email: `admin@tesproperty.com`
- Password: `admin123`

#### Agents
- Maria Santos: `maria@tesproperty.com` / `agent123`
- Pedro Garcia: `pedro@tesproperty.com` / `agent123`
- Juan dela Cruz: `juan@tesproperty.com` / `agent123`
- Anna Reyes: `anna@tesproperty.com` / `agent123`
- Carlos Lopez: `carlos@tesproperty.com` / `agent123`
- Sofia Mendoza: `sofia@tesproperty.com` / `agent123`

---

## ✨ Features

### Customer Portal
- Browse properties with filters
- Search by name, address, price range
- View property details with photo gallery
- Submit inquiries with duplicate detection
- Rate limiting prevents spam

### Admin Portal
- Dashboard with real-time statistics
- Manage inquiries (assign, reassign, update status)
- Manage properties (add, edit, change status)
- View agent performance
- Export reports to PDF/CSV
- Import properties from CSV
- Activity log viewer
- Property analytics
- Bulk operations on inquiries

### Agent Portal
- Dashboard with assigned inquiries
- Update inquiry status with notes
- Schedule property viewings
- Calendar with conflict detection
- View commission earnings
- Search and filter inquiries

---

## ⚠️ Known Limitations

This is a frontend-only MVP with intentional limitations:

### 1. Data Storage
- **Current**: JSON files or localStorage
- **Production**: Would use proper database (PostgreSQL, MongoDB, etc.)
- **Limitation**: No concurrent user safety, race conditions possible

### 2. Authentication
- **Current**: Hardcoded test accounts, plain text passwords
- **Production**: Would use proper auth (JWT, OAuth, bcrypt)
- **Limitation**: Not secure, anyone can see passwords in JSON

### 3. Agent Creation
- **Current**: Manual JSON file editing by system admin
- **Production**: Admin UI with proper validation and permissions
- **Design Choice**: Intentional for security in MVP

### 4. File Storage
- **Current**: Base64 images in JSON (bloats file size)
- **Production**: Cloud storage (AWS S3, Cloudinary) with URLs
- **Limitation**: Large images slow down system

### 5. Real-time Updates
- **Current**: 30-second auto-refresh
- **Production**: WebSockets, Server-Sent Events, or polling
- **Limitation**: Not truly real-time, may see stale data briefly

### 6. Email/SMS Notifications
- **Current**: None (agents manually contact customers)
- **Production**: SendGrid, Twilio integration
- **Limitation**: No automated notifications

### 7. Payment Processing
- **Current**: Manual tracking only
- **Production**: PayMongo, PayPal, Stripe integration
- **Limitation**: No online payments, proof of payment uploads

### 8. Search
- **Current**: Client-side filtering (loads all data)
- **Production**: Server-side search with pagination
- **Limitation**: Slow with large datasets

### 9. Security
- **Current**: Client-side validation only
- **Production**: Server-side validation, rate limiting, CSRF protection
- **Limitation**: Can be bypassed with browser dev tools

### 10. Scalability
- **Current**: Works well for 100-500 properties, 1000-5000 inquiries
- **Production**: Database indexing, caching, CDN
- **Limitation**: Performance degrades with growth

---

## 🛠️ Tech Stack

### Frontend
- **HTML5, CSS3, TypeScript** - Core technologies
- **Alpine.js** - Lightweight reactive framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Validation & Security
- **Joi** - Schema validation for all forms
- **DOMPurify** - XSS prevention
- **browser-image-compression** - Image optimization

### PWA
- **Service Worker** - Offline support
- **Web App Manifest** - Installable app
- **Workbox** - PWA tooling

### Backend (Optional)
- **Express.js** - Simple REST API server
- **Node.js** - JavaScript runtime
- **CORS** - Cross-origin requests

### Reporting
- **jsPDF** - PDF generation
- **PapaParse** - CSV parsing

---

## 📖 Documentation Files

- **README.md** - This file
- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT-CHECKLIST.md** - Pre-deployment checks
- **PROJECT-SUMMARY.md** - Project overview
- **IMPLEMENTATION-GUIDE.md** - Developer guide

---

## 📞 Support

For questions or issues:
- **Email**: dev@tesproperty.com
- **GitHub Issues**: [Open an issue](https://github.com/hanszelmur/FINALrepoFORfrontendsimplified.v2/issues)

---

## 📄 License

Demonstration project for educational purposes.

---

**Built with ❤️ for TES Property - Version 2.0**
