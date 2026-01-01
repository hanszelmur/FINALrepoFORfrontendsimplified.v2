# 🏠 TES Property System v2 - Real Estate Inquiry Management

A complete professional real estate management system with JSON file storage, comprehensive validations, and progressive web app capabilities.

## 🌟 System Architecture

TES Property System is a **multi-port Single Page Application (SPA)** architecture with separate portals for different user roles, all connected to a unified backend API.

### Port Configuration

| Service | Port | Access | Purpose |
|---------|------|--------|---------|
| **Backend API** | 3000 | Internal | REST API for all data operations |
| **Customer Portal** | 3001 | Public | Browse properties & submit inquiries |
| **Admin Portal** | 3002 | Admin Only | Manage properties, inquiries & agents |
| **Agent Portal** | 3003 | Agents | View assigned inquiries & schedules |
| **Super Admin Portal** | 3004 | Admin Only | HR management & employment |

### Portal Overview

#### 🛍️ Customer Portal (Port 3001)
- Browse available properties with advanced filters
- View detailed property information with photo galleries
- Submit property inquiries
- Progressive Web App (PWA) capabilities
- Fully responsive design

#### 🎛️ Admin Portal (Port 3002)
- **Dashboard**: Real-time statistics and activity monitoring
- **Property Management**: Add, edit, and manage 40+ property fields
- **Inquiry Management**: Assign inquiries to agents, track status
- **Agent Management**: View agent performance and statistics
- **Reports & Analytics**: Export data in CSV/PDF formats
- **Enhanced Property Creation**: Professional form with accordion sections

#### 👨‍💼 Agent Portal (Port 3003)
- View assigned inquiries
- Update inquiry status
- Manage calendar and viewing schedules
- Track personal performance metrics

#### 🏢 Super Admin Portal (Port 3004)
- **HR Management**: Complete employment registration system
- **Agent Creation**: Comprehensive form with 7 sections:
  - Basic Information (name, email, phone, password)
  - Employment Details (ID, position, department, hire date)
  - License Information (PRC number, expiry, specialization)
  - Address Information (full Philippine address)
  - Emergency Contact (required)
  - Government IDs (SSS, TIN, PhilHealth, Pag-IBIG)
  - Internal Notes
- Auto-generation of Employee IDs (EMP-YYYY-XXX format)
- Auto-calculation of probation dates (+3 months)
- Access control (admin role only)
- Success modal with credential copy functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FINALrepoFORfrontendsimplified.v2

# Install dependencies
npm install

# Start all services (recommended)
npm run dev:all
```

This will start:
- Backend API on http://localhost:3000
- Customer Portal on http://localhost:3001
- Admin Portal on http://localhost:3002
- Agent Portal on http://localhost:3003
- Super Admin Portal on http://localhost:3004

### Environment Configuration

The application supports environment variables for configuration. Create a `.env` file in the root directory (use `.env.example` as a template):

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

**Available Environment Variables:**
- `PORT` - Backend API port (default: 3000)
- `ALLOWED_ORIGINS` - Comma-separated CORS origins (default: localhost:3001-3004)
- `NODE_ENV` - Environment mode (development/production)
- `VITE_API_URL` - API base URL for frontend

For development, the default values work out of the box. For production deployment, see [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md).

### Individual Portal Start

```bash
# Start only backend
npm run backend

# Start individual portals
npm run dev:customer    # Port 3001
npm run dev:admin       # Port 3002
npm run dev:agent       # Port 3003
npm run dev:superadmin  # Port 3004
```

### Build for Production

```bash
# Build all portals
npm run build:all

# Build individual portals
npm run build:customer
npm run build:admin
npm run build:agent
npm run build:superadmin
```

## 👥 User Roles & Access

> **⚠️ SECURITY NOTICE:** The hardcoded credentials below are for **development/demo purposes ONLY**. In production, these must be changed and stored securely using environment variables or a secrets management system.

### Admin User
- **Default Credentials**: admin@tesproperty.com / admin123
- **Access**: Admin Portal (3002) + Super Admin Portal (3004)
- **Capabilities**:
  - Full property management
  - Inquiry assignment and tracking
  - Agent performance monitoring
  - HR management and agent creation
  - Report generation and export

### Agent Users
- **Access**: Agent Portal (3003)
- **Capabilities**:
  - View assigned inquiries
  - Update inquiry status
  - Manage viewing schedules
  - Track personal metrics

### Public Access
- **Access**: Customer Portal (3001)
- **Capabilities**:
  - Browse properties
  - Submit inquiries
  - No login required

## 📝 How to Add New Agent

The **Super Admin Portal** at http://localhost:3004 is the **ONLY** supported method for creating new agent accounts in production environments.

### Using Super Admin Portal (Official Method)

**Steps:**

1. Login to Admin Portal (http://localhost:3002) with admin credentials
2. Click "🏢 HR Portal →" in the sidebar to open Super Admin Portal
3. Fill out the comprehensive employment registration form with 7 sections:
   - **Basic Info**: Name, email (auto-checked for duplicates), phone, password
   - **Employment Details**: Position, department, hire date, employment type
   - **License Information**: PRC number, expiry, specialization (if applicable)
   - **Address Information**: Full Philippine address with ZIP code
   - **Emergency Contact**: Required contact information
   - **Government IDs**: SSS, TIN, PhilHealth, Pag-IBIG numbers
   - **Internal Notes**: Recruitment and HR notes
4. Click "Create Agent Account" button
5. Success modal displays the new agent's credentials - **copy and share securely**
6. Choose: "Add Another Agent" or "View All Agents"

**Features:**
- ✅ Real-time email duplicate checking
- ✅ Auto-generated Employee ID (EMP-YYYY-XXX format)
- ✅ Auto-calculated probation end date (+3 months from hire date)
- ✅ Phone format validation (0917-XXX-XXXX)
- ✅ Form progress indicator
- ✅ Complete validation with inline error messages
- ✅ Credential copy-to-clipboard functionality

**Important:**
- This is the **ONLY** supported production method
- All agent accounts must be created through this portal
- Direct database editing is **NOT** supported for normal operations
- Single admin deployment (company standard) - race conditions not applicable

## 🏘️ Enhanced Property Creation

The Admin Portal now features a **professional 40+ field property form** with:

### Accordion Sections

1. **📋 Basic Information** (Auto-open)
   - Property Code (auto-generated: PROP-YYYY-XXXX)
   - Title, Description
   - Price, Price Per Sqm (auto-calculated)
   - Bedrooms, Bathrooms
   - Square Meters (lot), Floor Area
   - Property Type, Status

2. **🏠 Property Details**
   - Year Built (validated ≤ current year)
   - Number of Floors
   - Parking Spaces
   - Furnished Status (Fully/Semi/Unfurnished)
   - Facing Direction (N/S/E/W)

3. **✨ Features & Amenities** (15 checkboxes)
   - Swimming Pool, Garden, Balcony, Garage
   - Security System, CCTV, 24/7 Security
   - Gym, Playground, Clubhouse
   - Generator, Water Tank, Solar Panels
   - Pet-Friendly, Wheelchair Accessible

4. **📍 Location**
   - Street, Barangay, City, Province, ZIP
   - Nearby Landmarks (textarea)

5. **💰 Pricing**
   - Listed Price
   - Price Per Sqm (auto-calculated)
   - Negotiable checkbox
   - Minimum Offer (if negotiable)

6. **📄 Legal Documents**
   - Title Type (TCT/CCT/OCT/Others)
   - Title Number
   - Tax Declaration Number
   - Ownership Type

7. **📸 Photos** (Required)
   - Upload up to 10 photos
   - 2MB max per photo
   - Auto-compression
   - Preview with delete option
   - Main photo designation

8. **📝 Metadata** (Auto-filled)
   - Date Added (ISO timestamp)
   - Added By (current user)
   - Added By Email
   - Last Updated
   - Source (Direct Owner/Developer/Broker/Referral)
   - Internal Notes

### Form Features
- **Progress Indicator**: Shows completion percentage
- **Real-time Validation**: Inline error messages
- **Auto-calculations**: Price per sqm, probation dates
- **Responsive Design**: Works on all screen sizes
- **Accordion UI**: Collapsible sections for better UX

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

## 🔥 Multi-Port SPA Conversion (Latest Update)

This update transforms the application into a true multi-port Single Page Application architecture with REST API backend.

### Key Changes

#### Firebase → REST API Migration
- ✅ **Removed all Firebase client SDK usage** from admin and agent portals
- ✅ **Replaced Firebase Realtime Database calls** with REST API fetch() calls  
- ✅ **Converted Firebase write operations** to REST API POST/PUT/DELETE
- ✅ **Replaced real-time listeners** with polling-based refresh (Page Visibility API)
- ✅ **All data operations** now use `/api/*` endpoints from server.js

#### Customer Portal SPA Conversion
- ✅ **Property details** converted to modal overlay (no separate page)
- ✅ **Inquiry form** converted to modal overlay (no separate page)
- ✅ **View Details button** now opens modal instead of navigating
- ✅ **Inquiry submission** sends POST to `/api/inquiries`
- ✅ **All content** in single HTML file - true SPA

#### Admin Portal SPA Enhancement
- ✅ **Hash routing** for all sections (#dashboard, #inquiries, #properties, etc.)
- ✅ **Browser back/forward** buttons work correctly
- ✅ **No page reloads** when navigating between sections
- ✅ **Data operations** via REST API (properties, inquiries, users, reports)
- ✅ **Polling refresh** every 30 seconds when page visible

#### Agent Portal SPA Enhancement
- ✅ **Hash routing** for all sections (#dashboard, #inquiries, #calendar, etc.)
- ✅ **Calendar operations** via REST API `/api/calendar`
- ✅ **Inquiry updates** via REST API PUT
- ✅ **Statistics loaded** from REST API
- ✅ **No Firebase dependencies**

#### Multi-Port Architecture
- ✅ **Customer portal** runs on port 3001 (Vite)
- ✅ **Admin portal** runs on port 3002 (Vite)
- ✅ **Agent portal** runs on port 3003 (Vite)
- ✅ **Backend server** runs on port 3000 (Express)
- ✅ **Concurrent execution** via `npm run dev:all`
- ✅ **Independent operation** - each portal can run standalone

### How It Works

```
┌──────────────┐ Port 3001
│   Customer   │──────────┐
│    Portal    │          │
└──────────────┘          │
                          ├──→ ┌────────────┐ Port 3000
┌──────────────┐ Port 3002│    │  Backend   │
│    Admin     │──────────┤    │  Server    │
│    Portal    │          │    │ (Express)  │
└──────────────┘          │    └────────────┘
                          │          │
┌──────────────┐ Port 3003│          ↓
│    Agent     │──────────┘    ┌────────────┐
│    Portal    │               │    data/   │
└──────────────┘               │  (JSON)    │
                               └────────────┘
```

All portals communicate with the backend via REST API calls to `http://localhost:3000/api/*`.

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

#### ⚡ Multi-Port SPA Architecture (NEW!)

Each portal (Customer, Admin, Agent) now runs on its own dedicated port as a TRUE Single Page Application:

```bash
# Option 1: Run all portals simultaneously
npm run dev:all

# This starts:
# - Backend server: http://localhost:3000 (JSON file operations)
# - Customer portal: http://localhost:3001 (Property browsing)
# - Admin portal: http://localhost:3002 (Admin dashboard)
# - Agent portal: http://localhost:3003 (Agent dashboard)
```

```bash
# Option 2: Run individual portals
npm run backend           # Backend only (port 3000)
npm run dev:customer      # Customer portal only (port 3001)
npm run dev:admin         # Admin portal only (port 3002)
npm run dev:agent         # Agent portal only (port 3003)
```

**Key Features:**
- ✅ **TRUE SPAs**: All content embedded in single HTML file (no fetch/AJAX loading)
- ✅ **Hash Routing**: Navigate with `#dashboard`, `#inquiries`, etc.
- ✅ **Browser Back/Forward**: Works seamlessly
- ✅ **Same Tab Navigation**: No page reloads
- ✅ **Independent Portals**: Each can run standalone
- ✅ **Data Sync**: Backend syncs data across all portals

**Testing Data Sync:**
1. Open Admin portal: `http://localhost:3002`
2. Login and add a new property
3. Open Customer portal: `http://localhost:3001`
4. Property appears automatically (within 30 seconds)
5. Backend must be running for data to sync

#### Option 1: Frontend Only (Uses localStorage)

```bash
# Start Vite dev server (legacy single-port mode)
npm run dev

# Open browser to http://localhost:5173
```

#### Option 2: With Backend Server (legacy)

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
# Build all portals for production
npm run build:all

# This creates:
# - dist/customer/ - Customer portal build
# - dist/admin/ - Admin portal build
# - dist/agent/ - Agent portal build

# Or build individual portals
npm run build:customer
npm run build:admin
npm run build:agent

# Legacy build (single portal)
npm run build

# Preview production build
npm run preview

# Deploy dist/ folders to static hosts
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

## 📸 Application Screenshots

> **Note:** Screenshots below are placeholder references. To add actual screenshots, capture images from the running application and save them in the `screenshots/` directory with the filenames specified below.

### 🛍️ Customer Portal (Port 3001)

#### Property Listing (Main Screen)
![Customer Portal - Main Screen](./screenshots/customer-portal-main.png)
*Browse and filter available properties with search and category filters*

#### Property Details Modal
![Customer Portal - Property Details](./screenshots/customer-portal-details.png)
*Detailed property view with photo gallery and inquiry form*

---

### 🎛️ Admin Portal (Port 3002)

#### Dashboard
![Admin Portal - Dashboard](./screenshots/admin-portal-dashboard.png)
*Real-time statistics and activity monitoring with analytics*

#### Properties Management
![Admin Portal - Properties](./screenshots/admin-portal-properties.png)
*Comprehensive 40+ field property creation form with accordion sections*

---

### 👨‍💼 Agent Portal (Port 3003)

#### Agent Dashboard
![Agent Portal - Dashboard](./screenshots/agent-portal-dashboard.png)
*Agent-specific dashboard with assigned inquiries and performance metrics*

---

### 🏢 Super Admin Portal (Port 3004)

#### Employment Registration Form
![Super Admin Portal - Registration Form](./screenshots/superadmin-registration-form.png)
*Comprehensive HR management with 7 form sections: Basic Info, Employment Details, License Information, Address, Emergency Contact, Government IDs, and Internal Notes*

#### Success Modal with Credentials
![Super Admin Portal - Success Modal](./screenshots/superadmin-success-modal.png)
*Success confirmation with copyable credentials for newly created agent account*

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
- **Concurrently** - Run multiple servers simultaneously

### Architecture
- **Multi-Port SPA** - Each portal runs on dedicated port
- **Hash Routing** - Client-side navigation without page reloads
- **TRUE SPA** - All content embedded in single HTML files
- **Backend API** - RESTful endpoints on port 3000
- **Independent Portals** - Customer (3001), Admin (3002), Agent (3003)

### Reporting
- **jsPDF** - PDF generation
- **PapaParse** - CSV parsing

---

## 🚨 Appendix: Emergency/Developer Procedures

> **⚠️ WARNING:** The procedures in this section are for **EMERGENCY USE** or **LOCAL DEVELOPMENT ONLY**.  
> **DO NOT** use these methods in production environments.  
> **ALWAYS** use the Super Admin Portal for normal agent creation.

### Emergency Manual Agent Creation

**When to use:** 
- Server/portal is down and you need immediate agent access
- Local development/testing without starting the web portals
- Database recovery scenarios

**⚠️ Risks:**
- No validation checks (duplicate email, phone format, etc.)
- No auto-generation of Employee IDs or probation dates
- No activity log entries created
- Data consistency issues if done incorrectly
- May break referential integrity

**Procedure:**

1. **Stop the backend server** if running (to avoid file conflicts)

2. **Open `data/users.json`** in a text editor

3. **Add new entry to the `data` array:**

```json
{
  "id": 8,
  "name": "Emergency Agent Name",
  "email": "emergency@tesproperty.com",
  "password": "tempPassword123",
  "role": "agent",
  "phone": "0917-999-8888",
  "active": true,
  "employmentInfo": {
    "employeeId": "EMP-2025-008",
    "dateHired": "2025-12-10T00:00:00Z",
    "position": "Real Estate Agent",
    "department": "Sales",
    "employmentType": "Probationary",
    "probationEndDate": "2026-03-10T00:00:00Z"
  },
  "createdAt": "2025-12-10T00:00:00Z",
  "updatedAt": "2025-12-10T00:00:00Z"
}
```

4. **Update `_metadata.recordCount`** in both `users.json` and `new-agents.json`

5. **Also add to `data/new-agents.json`** (same structure)

6. **Manual Activity Log Entry** (optional): Add to `data/activity-log.json`:
```json
{
  "timestamp": "2025-12-10T10:00:00Z",
  "action": "ADD_AGENT_MANUAL",
  "section": "Users",
  "note": "Emergency manual agent creation - bypassed Super Admin Portal",
  "details": {
    "agentName": "Emergency Agent Name",
    "email": "emergency@tesproperty.com",
    "reason": "Server downtime / Testing",
    "addedBy": "System Administrator"
  }
}
```

7. **Restart the backend server:** `npm run backend`

8. **Verify in Super Admin Portal** that the agent appears correctly

9. **⚠️ IMPORTANT:** After emergency is resolved, **deactivate** this account and recreate properly through the Super Admin Portal

**Field Requirements:**
- `id` - Must be unique, use next sequential number
- `email` - Must be unique, valid email format
- `phone` - Format: `0917-XXX-XXXX` (e.g., `0917-999-8888`)
- `password` - **⚠️ SECURITY WARNING:** Currently stored as plaintext. Use a strong temporary password and require immediate change upon first login
- `employeeId` - Format: `EMP-YYYY-###` (e.g., `EMP-2025-008` where ### is a 3-digit sequential number)
- `dateHired` - ISO 8601 format (e.g., `2025-12-10T00:00:00Z`)
- `probationEndDate` - Exactly 3 months after `dateHired` in ISO 8601 format

**Post-Emergency Checklist:**
- [ ] Document why manual creation was necessary
- [ ] Verify agent can log in successfully
- [ ] Check for duplicate emails/IDs in database
- [ ] Plan to migrate to proper Super Admin creation when possible
- [ ] Update team about the emergency procedure used

---

**For all normal operations, use the Super Admin Portal at http://localhost:3004**

---

## ✅ QA Checklist & Testing

### Pre-Flight Checks

Before running the application:
```bash
# 1. Ensure all dependencies are installed
npm install

# 2. Verify data files exist
ls -la data/

# Expected files:
# - properties.json
# - inquiries.json
# - users.json
# - calendar.json
# - activity-log.json
```

### Smoke Tests

#### Backend Server
```bash
npm run backend

# Expected output:
# Server running on: http://localhost:3000
# Status: ✓ Ready to serve requests
```

Test API endpoints:
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/properties
curl http://localhost:3000/api/inquiries
```

#### Customer Portal (Port 3001)
```bash
npm run dev:customer

# Open: http://localhost:3001
```

**Tests:**
- [ ] Property listing loads (shows Available/Reserved/Pending properties)
- [ ] Filters work (price, type, location, status)
- [ ] Pagination works (Previous/Next buttons)
- [ ] Click "View Details" - modal opens with property info
- [ ] In property details modal, click "Inquire" - inquiry form opens
- [ ] Fill inquiry form and submit - success message appears
- [ ] Check browser console - no errors

#### Admin Portal (Port 3002)
```bash
npm run dev:admin

# Open: http://localhost:3002
```

**Login:**
- Username: `admin@tesproperty.com`
- Password: `admin123`

**Tests:**
- [ ] Dashboard loads - shows statistics cards
- [ ] Click "Inquiries" in sidebar - inquiries table loads
- [ ] Click "Properties" - properties table loads
- [ ] Click "Agents" - agents list loads
- [ ] Click "Reports" - reports section loads
- [ ] Add new property - saves successfully
- [ ] Assign inquiry to agent - updates successfully
- [ ] Check browser console - no errors
- [ ] Hash navigation works (#dashboard, #inquiries, etc.)
- [ ] Browser back/forward buttons work

#### Agent Portal (Port 3003)
```bash
npm run dev:agent

# Open: http://localhost:3003
```

**Login:**
- Username: `agent1@tesproperty.com` 
- Password: `agent123`

**Tests:**
- [ ] Dashboard loads - shows assigned inquiries count
- [ ] Click "My Inquiries" - my inquiries table loads
- [ ] Update inquiry status - saves successfully
- [ ] Add notes to inquiry - saves successfully
- [ ] Click "Calendar" - calendar events load
- [ ] Add new viewing event - saves successfully
- [ ] Click "My Properties" - properties with inquiries load
- [ ] Hash navigation works
- [ ] Browser back/forward buttons work

#### All Portals Together
```bash
npm run dev:all

# This starts all 4 servers simultaneously
```

**Tests:**
- [ ] All portals accessible at their respective URLs
- [ ] Add property in admin - appears in customer portal (within 30s)
- [ ] Submit inquiry in customer - appears in admin portal
- [ ] Assign inquiry in admin - appears in agent portal
- [ ] Data syncs across all portals

### Data Sync Verification

1. Open Admin portal (3002) and Customer portal (3001) side by side
2. In Admin: Add a new property with status "Available"
3. In Customer: Wait 30 seconds (auto-refresh) or manually refresh
4. Verify: New property appears in Customer portal listing
5. In Customer: Submit an inquiry for a property
6. In Admin: Refresh and go to Inquiries section
7. Verify: New inquiry appears with status "New"

### Mobile Responsiveness

- [ ] Resize browser to mobile width (375px)
- [ ] All buttons are touch-friendly (44x44px minimum)
- [ ] Navigation menu works on mobile
- [ ] Forms are usable on mobile
- [ ] Modals/sections fit mobile screen

### Console & Network Checks

**Browser Console:**
- [ ] No uncaught exceptions
- [ ] No 404 errors for assets
- [ ] Only expected warnings (if any)

**Network Tab:**
- [ ] API calls go to `http://localhost:3000/api/*`
- [ ] No Firebase URLs appear
- [ ] Successful responses (200, 201) for CRUD operations

---

## 📦 Available Scripts

### Development

```bash
# Start all services simultaneously (recommended)
npm run dev:all

# Start individual services
npm run backend        # Backend API only (port 3000)
npm run dev:customer   # Customer portal (port 3001)
npm run dev:admin      # Admin portal (port 3002)
npm run dev:agent      # Agent portal (port 3003)
npm run dev:superadmin # Super Admin portal (port 3004)
```

### Build

```bash
# Build all portals for production
npm run build:all

# Build individual portals
npm run build:customer
npm run build:admin
npm run build:agent
npm run build:superadmin
```

### Code Quality

```bash
# Lint TypeScript files
npm run lint

# Format code with Prettier
npm run format

# Preview production build
npm run preview
```

---

## 🗄️ Data Structure Documentation

### users.json Structure

Complete user/agent data with employment information:

```json
{
  "id": 8,
  "name": "Juan dela Cruz",
  "email": "juan@tesproperty.com",
  "password": "agent123",
  "role": "agent",
  "phone": "0917-888-8888",
  "active": true,
  "employmentInfo": {
    "employeeId": "EMP-2025-008",
    "dateHired": "2025-12-10T10:30:00Z",
    "position": "Real Estate Agent",
    "department": "Sales",
    "reportingTo": "Sales Manager",
    "employmentType": "Full-time",
    "probationEndDate": "2026-03-10T00:00:00Z",
    "emergencyContact": {
      "name": "Maria dela Cruz",
      "relationship": "Spouse",
      "phone": "0917-999-9999"
    },
    "address": {
      "street": "123 Main St",
      "barangay": "Brgy. Example",
      "city": "Quezon City",
      "province": "Metro Manila",
      "zipCode": "1100"
    },
    "governmentIds": {
      "sss": "12-3456789-0",
      "tin": "123-456-789-000",
      "philhealth": "12-345678901-2",
      "pagibig": "1234-5678-9012"
    },
    "licenseNumber": "PRC-123456",
    "licenseExpiry": "2027-12-31",
    "specialization": "Residential",
    "addedBy": "Admin User",
    "addedByEmail": "admin@tesproperty.com",
    "notes": "Recruited from Job Fair 2025"
  },
  "createdAt": "2025-12-10T10:30:00Z",
  "updatedAt": "2025-12-10T10:30:00Z"
}
```

### properties.json Structure

Enhanced property data with 40+ fields:

```json
{
  "id": 1,
  "propertyCode": "PROP-2025-0001",
  "title": "Modern 3-Bedroom House",
  "name": "Modern 3-Bedroom House",
  "description": "Beautiful modern house with garden...",
  "price": 8500000,
  "pricePerSqm": 42500,
  "bedrooms": 3,
  "bathrooms": 2,
  "squareMeters": 200,
  "floorArea": 180,
  "propertyType": "House",
  "status": "Available",
  "yearBuilt": 2020,
  "floors": 2,
  "parkingSpaces": 2,
  "furnishedStatus": "Semi-Furnished",
  "facingDirection": "North",
  "features": [
    "Swimming Pool",
    "Garden",
    "CCTV",
    "24/7 Security",
    "Garage"
  ],
  "address": {
    "street": "123 Main Street",
    "barangay": "Brgy. Example",
    "city": "Quezon City",
    "province": "Metro Manila",
    "zip": "1100",
    "nearbyLandmarks": "Near schools, malls, and hospitals"
  },
  "pricing": {
    "listedPrice": 8500000,
    "pricePerSqm": 42500,
    "negotiable": true,
    "minimumOffer": 8000000
  },
  "legal": {
    "titleType": "TCT",
    "titleNumber": "T-12345",
    "taxDeclaration": "TD-2024-12345",
    "ownershipType": "Individual"
  },
  "photos": [
    "data:image/jpeg;base64,...",
    "data:image/jpeg;base64,..."
  ],
  "reservationFee": 50000,
  "commission": 170000,
  "metadata": {
    "dateAdded": "2025-12-10T11:00:00Z",
    "addedBy": "Admin User",
    "addedByEmail": "admin@tesproperty.com",
    "lastUpdated": "2025-12-10T11:00:00Z",
    "updatedBy": "Admin User",
    "source": "Direct Owner",
    "internalNotes": "Owner needs quick sale"
  },
  "createdAt": "2025-12-10T11:00:00Z"
}
```

### inquiries.json Structure

Customer inquiry data:

```json
{
  "id": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "0917-123-4567",
  "propertyId": 1,
  "propertyName": "Modern House",
  "message": "Interested in viewing this property",
  "status": "New",
  "assignedAgentId": null,
  "assignedAgentName": null,
  "createdAt": "2025-12-10T12:00:00Z",
  "updatedAt": "2025-12-10T12:00:00Z"
}
```

### calendar-events.json Structure

Agent viewing schedule:

```json
{
  "id": 1,
  "type": "viewing",
  "title": "Property Viewing",
  "date": "2025-12-15",
  "time": "10:00",
  "duration": 60,
  "agentId": 2,
  "agentName": "Maria Santos",
  "propertyId": 1,
  "propertyName": "Modern House",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "0917-123-4567",
  "notes": "First time buyer",
  "createdAt": "2025-12-10T12:00:00Z"
}
```

### activity-log.json Structure

System activity tracking:

```json
{
  "timestamp": "2025-12-10T12:00:00Z",
  "action": "ADD_PROPERTY",
  "section": "Properties",
  "note": "Property added via admin portal",
  "details": {
    "propertyCode": "PROP-2025-0001",
    "propertyName": "Modern House",
    "price": 8500000,
    "addedBy": "Admin User"
  }
}
```

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
