# 🏠 TES Property - Real Estate Inquiry Management System

A complete frontend-only MVP for TES Property real estate company. This system manages customer inquiries, property viewings, and agent assignments with real-time cross-device sync using Firebase Realtime Database.

## 📌 Project Overview

**Company:** TES Property (Philippine real estate - buy/sell land lots)

**Problem Solved:** Customers previously had to visit the office to schedule viewings, leading to long queues and crowding.

**Solution:** Online inquiry system with real-time agent assignment and cross-device synchronization.

## 🚀 Features

### Customer Portal
- **Property Browsing** - Browse properties with filters (price, type, location, status)
- **Property Details** - View comprehensive property information with photo galleries
- **Inquiry Submission** - Submit inquiries with duplicate detection
- **How to Inquire Guide** - Complete guide for the inquiry and purchase process

### Admin Portal
- **Dashboard** - Real-time statistics and urgent notifications
- **Inquiry Management** - Assign/reassign inquiries to agents with validations
- **Property Management** - Add/edit properties, manage status workflow
- **Agent Management** - View agent performance and statistics
- **Reports & Analytics** - Export CSV reports with date range filters

### Agent Portal
- **Dashboard** - Task management with urgent items highlighted
- **My Inquiries** - Manage assigned inquiries, update status, add notes
- **Calendar** - Schedule viewings and manage availability
- **My Properties** - View properties with active inquiries and commissions

### Shared Features
- **Real-time Sync** - All data syncs automatically across devices
- **Role-based Access** - Separate interfaces for customers, agents, and admins
- **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Philippine Formats** - Currency (₱), phone numbers, and address formats

## 🔧 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Database:** Firebase Realtime Database
- **Styling:** Custom CSS, mobile-first responsive design
- **No frameworks** - Easy to understand and maintain

## 📦 Project Structure

```
├── index.html                 # Customer homepage
├── property-details.html      # Property details page
├── inquiry-form.html          # Inquiry submission form
├── how-to-inquire.html        # Customer guide
├── css/
│   └── style.css             # Main stylesheet
├── js/
│   ├── firebase-config.js    # Firebase configuration
│   ├── utils.js              # Utility functions
│   └── sample-data.js        # Sample data initialization
├── admin/
│   ├── dashboard.html        # Admin dashboard
│   ├── inquiries.html        # Inquiry management
│   ├── properties.html       # Property management
│   ├── agents.html           # Agent management
│   └── reports.html          # Reports and analytics
├── agent/
│   ├── dashboard.html        # Agent dashboard
│   ├── inquiries.html        # Agent inquiries
│   ├── calendar.html         # Agent calendar
│   └── my-properties.html    # Agent properties
└── shared/
    ├── login.html            # Authentication
    └── calendar-view.html    # Shared calendar
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FINALrepoFORfrontendsimplified.v2
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Realtime Database
4. Copy your Firebase configuration
5. Update `js/firebase-config.js` with your credentials

See [FIREBASE-SETUP.md](FIREBASE-SETUP.md) for detailed instructions.

### 3. Run the Application

**Option A: Using VS Code Live Server (Recommended)**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

**Option B: Using Python**
```bash
python -m http.server 8000
```
Then open http://localhost:8000

**Option C: Using Node.js**
```bash
npx http-server
```

### 4. Initialize Sample Data

1. Log in as admin (admin@tesproperty.com / admin123)
2. Open browser console (F12)
3. Run: `initializeSampleData()`

## 👥 Test Accounts

### Admin
- **Email:** admin@tesproperty.com
- **Password:** admin123

### Agents
- **Email:** maria@tesproperty.com | **Password:** agent123
- **Email:** pedro@tesproperty.com | **Password:** agent123
- **Email:** juan@tesproperty.com | **Password:** agent123

## 📱 Key Features Detail

### Inquiry Status Workflow (11 Statuses)
1. **New** - Initial inquiry submitted
2. **Assigned** - Assigned to an agent
3. **In Progress** - Agent is working on it
4. **Waiting - Property Reserved** - Property is reserved
5. **Viewing Scheduled** - Viewing date set
6. **Viewed - Interested** - Customer interested after viewing
7. **Viewed - Not Interested** - Customer not interested
8. **Viewed - Undecided** - Customer needs more time
9. **Deposit Paid** - Deposit received
10. **Successful** - Sale completed
11. **Cancelled** - Inquiry cancelled

### Property Status Workflow
- **Available** → **Reserved** → **Pending** → **Sold** / **Withdrawn**

### Validations
- ✅ Duplicate inquiry detection (same email/phone for same property)
- ✅ Philippine phone number validation (0917-123-4567)
- ✅ Email validation
- ✅ Price range validation (₱100,000 - ₱999,999,999)
- ✅ Reassignment restrictions (cannot reassign Deposit Paid/Successful inquiries)
- ✅ Agent workload warnings (20+ inquiries)

### Real-time Sync Scenarios
- Admin adds property → Customer sees it instantly
- Admin assigns inquiry → Agent receives notification
- Agent updates status → Admin dashboard updates
- Calendar events sync across all users

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[FIREBASE-SETUP.md](FIREBASE-SETUP.md)** - Firebase configuration guide

## 🎨 Design Philosophy

- **Clean & Professional** - Real estate theme with modern UI
- **Mobile-First** - Responsive design for all devices
- **User-Friendly** - Intuitive navigation and clear workflows
- **Philippine Context** - Local currency, phone, and address formats

## ⚠️ Known Limitations

This is an MVP (Minimum Viable Product) with the following limitations:

1. **Authentication** - Uses hardcoded test accounts (no real authentication)
2. **Security** - Firebase in test mode (not production-ready)
3. **File Uploads** - Uses placeholder images (no real file upload)
4. **Email/SMS** - No actual email/SMS integration
5. **Payment Processing** - Manual tracking only (no payment gateway)

## 🗺️ Roadmap

### Phase 2 (Future Enhancements)
- [ ] Real authentication system
- [ ] Email/SMS notifications
- [ ] File upload for property photos
- [ ] Payment gateway integration
- [ ] Advanced reporting with charts
- [ ] Multi-language support
- [ ] Dark mode

### Phase 3 (Backend Integration)
- [ ] Node.js backend API
- [ ] PostgreSQL database
- [ ] User management
- [ ] Role permissions
- [ ] Audit logging

## 🤝 Contributing

This is a demonstration project. For improvements or bug fixes, please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for demonstration purposes.

## 📞 Support

For questions or support:
- **Email:** info@tesproperty.com
- **Phone:** 0917-000-0000
- **Hours:** 8 AM - 10 PM Daily

---

**Built with ❤️ for TES Property**