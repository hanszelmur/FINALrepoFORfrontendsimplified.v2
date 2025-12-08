# 🏠 TES Property - Real Estate Inquiry Management System

A modern, production-quality frontend MVP built with TypeScript, Vite, Tailwind CSS, and Alpine.js. This system manages customer inquiries, property viewings, and agent assignments using LocalStorage for data persistence.

## 📌 Project Overview

**Company:** TES Property (Philippine real estate - buy/sell land lots)

**Problem Solved:** Customers previously had to visit the office to schedule viewings, leading to long queues and crowding.

**Solution:** Online inquiry system with real-time agent assignment and automatic data synchronization across browser sessions.

## 🚀 Tech Stack

- **TypeScript 5.3+** - Strict type checking, no `any` types
- **Vite 5.0** - Lightning-fast build tool with HMR
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Alpine.js 3.13** - Lightweight JavaScript framework
- **LocalStorage** - Client-side data persistence
- **ESLint + Prettier** - Code quality and formatting

## ✨ Key Features

### Customer Portal
- **Property Browsing** - Grid view with filters (price, type, location, status)
- **Real-time Updates** - Auto-refresh every 30 seconds
- **Duplicate Detection** - Prevents duplicate inquiries from same customer
- **Philippine Formats** - Currency (₱), phone numbers (0917-123-4567)
- **Mobile Responsive** - Works on all devices (320px+)

### Admin Portal
- **Dashboard** - Real-time statistics and unassigned inquiry alerts
- **Inquiry Management** - Assign/reassign inquiries to agents
- **Property Management** - Add/edit properties with status workflow
- **Agent Management** - View agent performance and workload
- **Reports** - CSV export with date range filters

### Agent Portal
- **Dashboard** - Task management with urgent items highlighted
- **My Inquiries** - Manage assigned inquiries, update status
- **Calendar** - Schedule viewings and manage availability
- **My Properties** - View properties with commissions

### Shared Features
- **Role-based Access** - Separate interfaces for customers, agents, and admins
- **Auto-refresh** - Data reloads every 30 seconds
- **Status Workflows** - 11 inquiry statuses, 5 property statuses
- **Commission Tracking** - Manual commission input per property
- **Reservation System** - 14-day countdown with expiry warnings

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FINALrepoFORfrontendsimplified.v2

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at http://localhost:5173

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🗂️ Project Structure

```
├── src/
│   ├── types/              # TypeScript interfaces
│   │   ├── property.ts     # Property interface (11 fields)
│   │   ├── inquiry.ts      # Inquiry interface (15 fields, 11 statuses)
│   │   ├── user.ts         # User interface (agent/admin roles)
│   │   ├── calendar.ts     # Calendar event interface
│   │   └── index.ts        # Type exports
│   ├── utils/              # Utility functions
│   │   ├── storage.ts      # LocalStorage CRUD operations
│   │   ├── validation.ts   # Form validation, duplicate detection
│   │   ├── formatter.ts    # PHP currency & phone formatting
│   │   └── sample-data.ts  # Sample data (10 properties, 6 agents, 15 inquiries)
│   ├── main.ts             # Entry point
│   └── style.css           # Tailwind CSS
├── public/                 # HTML pages
│   ├── index.html          # Customer homepage
│   ├── property-details.html
│   ├── inquiry-form.html
│   ├── how-to-inquire.html
│   ├── admin/              # Admin pages
│   ├── agent/              # Agent pages
│   └── shared/             # Shared pages (login, calendar)
├── dist/                   # Production build
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

## 📱 Responsive Design

- **Mobile:** 320px-767px (1 column, hamburger menu)
- **Tablet:** 768px-1024px (2 columns)
- **Desktop:** 1025px+ (3-4 columns)
- **Touch-friendly:** 44x44px minimum button size

## 🎨 Philippine-Specific Features

### Currency Formatting
```typescript
formatPHP(3500000) → "₱3,500,000.00"
```

### Phone Number Formatting
```typescript
formatPhoneNumber("09171234567") → "0917-123-4567"
formatPhoneNumber("+639171234567") → "0917-123-4567"
```

### Address Structure
- Street
- Barangay
- City
- Province
- ZIP (4 digits)

## 🔍 Sample Data

On first load, the system automatically populates LocalStorage with:

- **10 Properties** - Various types (House, Condo, Townhouse, Lot, Commercial)
- **6 Agents** - Different performance levels (3-8 active inquiries each)
- **1 Admin Account**
- **15 Inquiries** - All status types represented

### Test Accounts

**Admin:**
- Email: admin@tesproperty.com
- Password: admin123

**Agents:**
- maria@tesproperty.com / agent123
- pedro@tesproperty.com / agent123
- juan@tesproperty.com / agent123
- anna@tesproperty.com / agent123
- carlos@tesproperty.com / agent123
- sofia@tesproperty.com / agent123

## 🔄 Data Models

### Property Statuses (5)
1. **Available** (green) - Ready for inquiries
2. **Reserved** (orange) - Deposit paid, 14-day hold
3. **Pending** (blue) - Awaiting payment
4. **Sold** (gray) - Complete, archived
5. **Withdrawn** (red) - Removed from market

### Inquiry Statuses (11)
1. New
2. Assigned
3. In Progress
4. Waiting - Property Reserved
5. Viewing Scheduled
6. Viewed - Interested
7. Viewed - Not Interested
8. Viewed - Undecided
9. Deposit Paid
10. Successful
11. Cancelled

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Code Quality

- **TypeScript:** Strict mode, no `any` types
- **ESLint:** Catches code issues
- **Prettier:** Consistent code formatting
- **Tailwind:** Utility-first, no custom CSS

## ⚠️ Known Limitations

This is an MVP (Minimum Viable Product) with the following limitations:

1. **Authentication** - Hardcoded test accounts (no real authentication)
2. **Data Storage** - LocalStorage only (no backend/database)
3. **File Uploads** - Placeholder images (no real file upload)
4. **Email/SMS** - No actual email/SMS integration
5. **Payment Processing** - Manual tracking only (no payment gateway)
6. **Data Sync** - No multi-device sync (each browser has its own data)

## 🗺️ Roadmap

### Phase 2 (Backend Integration)
- [ ] Node.js + Express backend
- [ ] PostgreSQL or MySQL database
- [ ] Real authentication with JWT
- [ ] Email/SMS notifications
- [ ] File upload for property photos
- [ ] Payment gateway integration

### Phase 3 (Advanced Features)
- [ ] Advanced reporting with charts
- [ ] Multi-language support (English, Filipino)
- [ ] Dark mode
- [ ] Push notifications
- [ ] Mobile app (React Native)

## 📚 Documentation

### For Developers
- All TypeScript types are defined in `src/types/`
- Utility functions are in `src/utils/`
- HTML pages use Alpine.js for interactivity
- Tailwind utility classes for all styling

### For AI Assistants
This project uses:
- **TypeScript** for type safety
- **Vite** for fast builds and HMR
- **Tailwind CSS** for styling (no custom CSS)
- **Alpine.js** for reactive UI (no framework)
- **LocalStorage** for persistence (no backend)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run linter and formatter (`npm run lint && npm run format`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is for demonstration purposes.

## 📞 Support

For questions or support:
- **Email:** info@tesproperty.com
- **Phone:** 0917-000-0000
- **Hours:** 8 AM - 10 PM Daily

---

**Built with ❤️ for TES Property using modern TypeScript stack**
