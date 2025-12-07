// Sample Data Initialization for TES Property
// This script populates Firebase with sample properties, users, and inquiries

function initializeSampleData() {
  if (!database) {
    console.error('Firebase not initialized');
    return;
  }
  
  // Check if data already exists
  database.ref('properties').once('value', (snapshot) => {
    if (snapshot.exists()) {
      console.log('Sample data already exists');
      return;
    }
    
    console.log('Initializing sample data...');
    
    // Sample Properties
    const properties = {
      property_1: {
        id: 1,
        name: "Sunset Villa",
        address: {
          street: "123 Sunset Boulevard",
          barangay: "San Antonio",
          city: "Makati",
          province: "Metro Manila",
          zip: "1200"
        },
        price: 3500000,
        status: "Available",
        propertyType: "House",
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 120,
        description: "Beautiful house with modern amenities, perfect for families. Features spacious living areas, well-maintained garden, and convenient location near schools and shopping centers.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Sunset+Villa+Living+Room", caption: "Living Room" },
          { url: "https://via.placeholder.com/800x600?text=Sunset+Villa+Kitchen", caption: "Kitchen" },
          { url: "https://via.placeholder.com/800x600?text=Sunset+Villa+Bedroom", caption: "Master Bedroom" }
        ],
        reservationFee: 350000,
        commission: 120000,
        createdAt: "2025-12-01T10:00:00Z"
      },
      property_2: {
        id: 2,
        name: "Ocean View Condo",
        address: {
          street: "456 BGC Avenue",
          barangay: "Fort Bonifacio",
          city: "Taguig",
          province: "Metro Manila",
          zip: "1634"
        },
        price: 5200000,
        status: "Reserved",
        propertyType: "Condo",
        bedrooms: 2,
        bathrooms: 2,
        floorArea: 85,
        description: "Modern condominium unit with stunning city views. Fully furnished with premium appliances, 24/7 security, gym, and swimming pool amenities.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Ocean+View+Condo", caption: "Living Area" }
        ],
        reservationFee: 520000,
        commission: 180000,
        createdAt: "2025-11-25T14:30:00Z"
      },
      property_3: {
        id: 3,
        name: "Garden Townhouse",
        address: {
          street: "789 Garden Street",
          barangay: "Bagong Pag-asa",
          city: "Quezon City",
          province: "Metro Manila",
          zip: "1105"
        },
        price: 2800000,
        status: "Available",
        propertyType: "Townhouse",
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 100,
        description: "Cozy townhouse in a quiet neighborhood. Features private garden, car garage, and modern kitchen. Close to major roads and public transportation.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Garden+Townhouse", caption: "Exterior View" }
        ],
        reservationFee: 280000,
        commission: 95000,
        createdAt: "2025-11-28T09:15:00Z"
      },
      property_4: {
        id: 4,
        name: "Beach Lot",
        address: {
          street: "Seaside Road",
          barangay: "Matabungkay",
          city: "Lian",
          province: "Batangas",
          zip: "4216"
        },
        price: 1500000,
        status: "Available",
        propertyType: "Lot",
        bedrooms: 0,
        bathrooms: 0,
        floorArea: 300,
        description: "Prime beachfront lot perfect for vacation home or resort development. Clean title, ready for construction.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Beach+Lot", caption: "Beach View" }
        ],
        reservationFee: 150000,
        commission: 50000,
        createdAt: "2025-11-20T11:00:00Z"
      },
      property_5: {
        id: 5,
        name: "Commercial Space",
        address: {
          street: "234 Ortigas Avenue",
          barangay: "Ugong",
          city: "Pasig",
          province: "Metro Manila",
          zip: "1605"
        },
        price: 8000000,
        status: "Pending",
        propertyType: "Commercial",
        bedrooms: 0,
        bathrooms: 2,
        floorArea: 150,
        description: "Prime commercial space in Ortigas business district. Ground floor location with high foot traffic, ideal for retail or office use.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Commercial+Space", caption: "Interior" }
        ],
        reservationFee: 800000,
        commission: 280000,
        createdAt: "2025-11-15T13:45:00Z"
      },
      property_6: {
        id: 6,
        name: "Studio Unit",
        address: {
          street: "567 Pedro Gil Street",
          barangay: "Paco",
          city: "Manila",
          province: "Metro Manila",
          zip: "1007"
        },
        price: 850000,
        status: "Available",
        propertyType: "Condo",
        bedrooms: 1,
        bathrooms: 1,
        floorArea: 22,
        description: "Affordable studio unit perfect for students or young professionals. Near universities and hospitals, with basic amenities.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Studio+Unit", caption: "Studio View" }
        ],
        reservationFee: 85000,
        commission: 30000,
        createdAt: "2025-11-18T16:20:00Z"
      },
      property_7: {
        id: 7,
        name: "Family Home",
        address: {
          street: "890 Aguinaldo Highway",
          barangay: "Dasmarinas",
          city: "Imus",
          province: "Cavite",
          zip: "4103"
        },
        price: 4200000,
        status: "Sold",
        propertyType: "House",
        bedrooms: 4,
        bathrooms: 3,
        floorArea: 180,
        description: "Spacious family home with large backyard. Perfect for growing families, with extra room for home office or playroom.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Family+Home", caption: "Front View" }
        ],
        reservationFee: 420000,
        commission: 145000,
        createdAt: "2025-10-10T10:00:00Z",
        soldDate: "2025-11-30T14:00:00Z",
        finalSalePrice: 4200000,
        commissionPaid: true
      },
      property_8: {
        id: 8,
        name: "Duplex",
        address: {
          street: "345 C5 Road",
          barangay: "Ugong",
          city: "Pasig",
          province: "Metro Manila",
          zip: "1604"
        },
        price: 3000000,
        status: "Available",
        propertyType: "Townhouse",
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 110,
        description: "Modern duplex unit with separate entrance. Ideal for families who want privacy and space at an affordable price.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Duplex", caption: "Exterior" }
        ],
        reservationFee: 300000,
        commission: 105000,
        createdAt: "2025-11-22T12:30:00Z"
      },
      property_9: {
        id: 9,
        name: "Vacant Lot",
        address: {
          street: "Tagaytay-Calamba Road",
          barangay: "Silang Junction",
          city: "Tagaytay",
          province: "Cavite",
          zip: "4120"
        },
        price: 2500000,
        status: "Available",
        propertyType: "Lot",
        bedrooms: 0,
        bathrooms: 0,
        floorArea: 500,
        description: "Elevated lot with cool climate and beautiful view. Perfect for building your dream home or retirement house.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Vacant+Lot", caption: "Lot View" }
        ],
        reservationFee: 250000,
        commission: 85000,
        createdAt: "2025-11-12T09:00:00Z"
      },
      property_10: {
        id: 10,
        name: "Penthouse",
        address: {
          street: "678 Ayala Avenue",
          barangay: "Bel-Air",
          city: "Makati",
          province: "Metro Manila",
          zip: "1209"
        },
        price: 12000000,
        status: "Available",
        propertyType: "Condo",
        bedrooms: 3,
        bathrooms: 3,
        floorArea: 200,
        description: "Luxurious penthouse with panoramic city views. Premium finishes, smart home features, private elevator, and exclusive rooftop access.",
        photos: [
          { url: "https://via.placeholder.com/800x600?text=Penthouse", caption: "Living Room" }
        ],
        reservationFee: 1200000,
        commission: 420000,
        createdAt: "2025-11-05T15:00:00Z"
      }
    };
    
    // Sample Users (Agents + Admin)
    const users = {
      user_1: {
        id: 1,
        name: "Maria Santos",
        email: "maria@tesproperty.com",
        role: "agent",
        phone: "0917-123-4567",
        activeInquiries: 8,
        propertiesSold: 5,
        totalCommission: 450000
      },
      user_2: {
        id: 2,
        name: "Pedro Garcia",
        email: "pedro@tesproperty.com",
        role: "agent",
        phone: "0918-234-5678",
        activeInquiries: 5,
        propertiesSold: 3,
        totalCommission: 280000
      },
      user_3: {
        id: 3,
        name: "Juan Dela Cruz",
        email: "juan@tesproperty.com",
        role: "agent",
        phone: "0919-345-6789",
        activeInquiries: 12,
        propertiesSold: 8,
        totalCommission: 620000
      },
      user_4: {
        id: 4,
        name: "Anna Reyes",
        email: "anna@tesproperty.com",
        role: "agent",
        phone: "0920-456-7890",
        activeInquiries: 3,
        propertiesSold: 2,
        totalCommission: 180000
      },
      user_5: {
        id: 5,
        name: "Carlos Mendoza",
        email: "carlos@tesproperty.com",
        role: "agent",
        phone: "0921-567-8901",
        activeInquiries: 7,
        propertiesSold: 4,
        totalCommission: 350000
      },
      user_6: {
        id: 6,
        name: "Sofia Cruz",
        email: "sofia@tesproperty.com",
        role: "agent",
        phone: "0922-678-9012",
        activeInquiries: 6,
        propertiesSold: 3,
        totalCommission: 290000
      },
      user_admin: {
        id: 7,
        name: "Admin User",
        email: "admin@tesproperty.com",
        role: "admin",
        phone: "0917-000-0000"
      }
    };
    
    // Sample Inquiries
    const inquiries = {
      inquiry_1: {
        id: 1,
        propertyId: 1,
        propertyName: "Sunset Villa",
        customerName: "Juan Dela Cruz",
        customerEmail: "juan@email.com",
        customerPhone: "0917-111-2222",
        preferredContact: "SMS",
        numberOfGuests: 3,
        message: "Interested in viewing this property. Available this weekend.",
        notes: "",
        status: "New",
        assignedAgentId: null,
        assignedAgentName: null,
        noShowCount: 0,
        createdAt: "2025-12-07T14:30:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-12-07T14:30:00Z" }
        ]
      },
      inquiry_2: {
        id: 2,
        propertyId: 2,
        propertyName: "Ocean View Condo",
        customerName: "Maria Santos",
        customerEmail: "maria.customer@email.com",
        customerPhone: "0918-222-3333",
        preferredContact: "Email",
        numberOfGuests: 2,
        message: "Looking for a condo unit in BGC area.",
        notes: "",
        status: "Assigned",
        assignedAgentId: 1,
        assignedAgentName: "Maria Santos",
        noShowCount: 0,
        createdAt: "2025-12-06T10:15:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-12-06T10:15:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-12-06T11:00:00Z" }
        ]
      },
      inquiry_3: {
        id: 3,
        propertyId: 3,
        propertyName: "Garden Townhouse",
        customerName: "Pedro Reyes",
        customerEmail: "pedro.r@email.com",
        customerPhone: "0919-333-4444",
        preferredContact: "Messenger",
        numberOfGuests: 4,
        message: "Need a family home in QC.",
        notes: "Customer prefers morning viewings",
        status: "In Progress",
        assignedAgentId: 2,
        assignedAgentName: "Pedro Garcia",
        noShowCount: 0,
        createdAt: "2025-12-05T09:20:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-12-05T09:20:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-12-05T10:00:00Z" },
          { status: "In Progress", changedBy: "agent", timestamp: "2025-12-05T14:30:00Z" }
        ]
      },
      inquiry_4: {
        id: 4,
        propertyId: 1,
        propertyName: "Sunset Villa",
        customerName: "Anna Cruz",
        customerEmail: "anna.c@email.com",
        customerPhone: "0920-444-5555",
        preferredContact: "SMS",
        numberOfGuests: 2,
        message: "Interested in this property for investment.",
        notes: "",
        status: "Viewing Scheduled",
        assignedAgentId: 1,
        assignedAgentName: "Maria Santos",
        noShowCount: 0,
        createdAt: "2025-12-04T11:00:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-12-04T11:00:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-12-04T12:00:00Z" },
          { status: "Viewing Scheduled", changedBy: "agent", timestamp: "2025-12-05T09:00:00Z" }
        ]
      },
      inquiry_5: {
        id: 5,
        propertyId: 4,
        propertyName: "Beach Lot",
        customerName: "Carlos Mendez",
        customerEmail: "carlos.m@email.com",
        customerPhone: "0921-555-6666",
        preferredContact: "Email",
        numberOfGuests: 1,
        message: "Looking for beach property for vacation home.",
        notes: "Customer is from abroad, prefers virtual tour first",
        status: "Viewed - Interested",
        assignedAgentId: 3,
        assignedAgentName: "Juan Dela Cruz",
        noShowCount: 0,
        createdAt: "2025-12-03T08:30:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-12-03T08:30:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-12-03T09:00:00Z" },
          { status: "Viewing Scheduled", changedBy: "agent", timestamp: "2025-12-03T14:00:00Z" },
          { status: "Viewed - Interested", changedBy: "agent", timestamp: "2025-12-04T16:00:00Z" }
        ]
      },
      inquiry_6: {
        id: 6,
        propertyId: 6,
        propertyName: "Studio Unit",
        customerName: "Sofia Lopez",
        customerEmail: "sofia.l@email.com",
        customerPhone: "0922-666-7777",
        preferredContact: "SMS",
        numberOfGuests: 1,
        message: "Student looking for affordable unit near university.",
        notes: "",
        status: "Viewed - Not Interested",
        assignedAgentId: 4,
        assignedAgentName: "Anna Reyes",
        noShowCount: 0,
        createdAt: "2025-12-02T13:45:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-12-02T13:45:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-12-02T14:00:00Z" },
          { status: "Viewing Scheduled", changedBy: "agent", timestamp: "2025-12-03T09:00:00Z" },
          { status: "Viewed - Not Interested", changedBy: "agent", timestamp: "2025-12-03T15:00:00Z" }
        ]
      },
      inquiry_7: {
        id: 7,
        propertyId: 8,
        propertyName: "Duplex",
        customerName: "Roberto Tan",
        customerEmail: "roberto.t@email.com",
        customerPhone: "0917-777-8888",
        preferredContact: "Messenger",
        numberOfGuests: 3,
        message: "Looking for townhouse for family.",
        notes: "",
        status: "Viewed - Undecided",
        assignedAgentId: 5,
        assignedAgentName: "Carlos Mendoza",
        noShowCount: 0,
        createdAt: "2025-12-01T10:00:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-12-01T10:00:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-12-01T11:00:00Z" },
          { status: "Viewing Scheduled", changedBy: "agent", timestamp: "2025-12-02T09:00:00Z" },
          { status: "Viewed - Undecided", changedBy: "agent", timestamp: "2025-12-02T16:00:00Z" }
        ]
      },
      inquiry_8: {
        id: 8,
        propertyId: 10,
        propertyName: "Penthouse",
        customerName: "Victoria Wang",
        customerEmail: "victoria.w@email.com",
        customerPhone: "0918-888-9999",
        preferredContact: "Email",
        numberOfGuests: 2,
        message: "Interested in luxury properties in Makati.",
        notes: "VIP client, requires special attention",
        status: "Deposit Paid",
        assignedAgentId: 3,
        assignedAgentName: "Juan Dela Cruz",
        noShowCount: 0,
        createdAt: "2025-11-28T09:00:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-28T09:00:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-28T10:00:00Z" },
          { status: "Viewing Scheduled", changedBy: "agent", timestamp: "2025-11-29T09:00:00Z" },
          { status: "Viewed - Interested", changedBy: "agent", timestamp: "2025-11-29T15:00:00Z" },
          { status: "Deposit Paid", changedBy: "agent", timestamp: "2025-12-01T10:00:00Z" }
        ]
      },
      inquiry_9: {
        id: 9,
        propertyId: 9,
        propertyName: "Vacant Lot",
        customerName: "Gabriel Santos",
        customerEmail: "gabriel.s@email.com",
        customerPhone: "0919-999-0000",
        preferredContact: "SMS",
        numberOfGuests: 2,
        message: "Looking for lot in Tagaytay for retirement home.",
        notes: "",
        status: "Cancelled",
        assignedAgentId: 6,
        assignedAgentName: "Sofia Cruz",
        noShowCount: 1,
        createdAt: "2025-11-25T14:20:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-25T14:20:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-25T15:00:00Z" },
          { status: "Viewing Scheduled", changedBy: "agent", timestamp: "2025-11-26T10:00:00Z" },
          { status: "Cancelled", changedBy: "customer", timestamp: "2025-11-28T09:00:00Z" }
        ]
      },
      inquiry_10: {
        id: 10,
        propertyId: 3,
        propertyName: "Garden Townhouse",
        customerName: "Isabel Ramos",
        customerEmail: "isabel.r@email.com",
        customerPhone: "0920-000-1111",
        preferredContact: "Email",
        numberOfGuests: 4,
        message: "Family of 5 looking for townhouse.",
        notes: "Has 2 dogs, needs pet-friendly property",
        status: "Assigned",
        assignedAgentId: 2,
        assignedAgentName: "Pedro Garcia",
        noShowCount: 0,
        createdAt: "2025-11-24T11:30:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-24T11:30:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-24T12:00:00Z" }
        ]
      },
      inquiry_11: {
        id: 11,
        propertyId: 1,
        propertyName: "Sunset Villa",
        customerName: "Fernando Diaz",
        customerEmail: "fernando.d@email.com",
        customerPhone: "0921-111-2222",
        preferredContact: "Messenger",
        numberOfGuests: 3,
        message: "Interested in house near good schools.",
        notes: "",
        status: "In Progress",
        assignedAgentId: 1,
        assignedAgentName: "Maria Santos",
        noShowCount: 0,
        createdAt: "2025-11-23T09:15:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-23T09:15:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-23T10:00:00Z" },
          { status: "In Progress", changedBy: "agent", timestamp: "2025-11-24T14:00:00Z" }
        ]
      },
      inquiry_12: {
        id: 12,
        propertyId: 5,
        propertyName: "Commercial Space",
        customerName: "Business Corp",
        customerEmail: "contact@businesscorp.com",
        customerPhone: "0917-222-3333",
        preferredContact: "Email",
        numberOfGuests: 2,
        message: "Looking for commercial space for branch office.",
        notes: "Corporate client, requires formal proposal",
        status: "Waiting - Property Reserved",
        assignedAgentId: 3,
        assignedAgentName: "Juan Dela Cruz",
        noShowCount: 0,
        createdAt: "2025-11-20T13:00:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-20T13:00:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-20T14:00:00Z" },
          { status: "Waiting - Property Reserved", changedBy: "admin", timestamp: "2025-11-22T10:00:00Z" }
        ]
      },
      inquiry_13: {
        id: 13,
        propertyId: 8,
        propertyName: "Duplex",
        customerName: "Linda Garcia",
        customerEmail: "linda.g@email.com",
        customerPhone: "0918-333-4444",
        preferredContact: "SMS",
        numberOfGuests: 2,
        message: "Need viewing ASAP.",
        notes: "",
        status: "Viewing Scheduled",
        assignedAgentId: 5,
        assignedAgentName: "Carlos Mendoza",
        noShowCount: 0,
        createdAt: "2025-11-19T16:45:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-19T16:45:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-20T09:00:00Z" },
          { status: "Viewing Scheduled", changedBy: "agent", timestamp: "2025-11-20T14:00:00Z" }
        ]
      },
      inquiry_14: {
        id: 14,
        propertyId: 6,
        propertyName: "Studio Unit",
        customerName: "Mark Johnson",
        customerEmail: "mark.j@email.com",
        customerPhone: "0919-444-5555",
        preferredContact: "Email",
        numberOfGuests: 1,
        message: "Expat looking for temporary accommodation.",
        notes: "",
        status: "In Progress",
        assignedAgentId: 4,
        assignedAgentName: "Anna Reyes",
        noShowCount: 0,
        createdAt: "2025-11-18T10:20:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-18T10:20:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-18T11:00:00Z" },
          { status: "In Progress", changedBy: "agent", timestamp: "2025-11-19T09:00:00Z" }
        ]
      },
      inquiry_15: {
        id: 15,
        propertyId: 9,
        propertyName: "Vacant Lot",
        customerName: "Patricia Lee",
        customerEmail: "patricia.l@email.com",
        customerPhone: "0920-555-6666",
        preferredContact: "Messenger",
        numberOfGuests: 2,
        message: "Interested in lot for building resort.",
        notes: "",
        status: "Assigned",
        assignedAgentId: 6,
        assignedAgentName: "Sofia Cruz",
        noShowCount: 0,
        createdAt: "2025-11-17T14:30:00Z",
        statusHistory: [
          { status: "New", changedBy: "system", timestamp: "2025-11-17T14:30:00Z" },
          { status: "Assigned", changedBy: "admin", timestamp: "2025-11-18T09:00:00Z" }
        ]
      }
    };
    
    // Sample Calendar Events
    const calendar = {
      event_1: {
        id: 1,
        type: "viewing",
        agentId: 1,
        agentName: "Maria Santos",
        propertyId: 1,
        propertyName: "Sunset Villa",
        inquiryId: 4,
        customerName: "Anna Cruz",
        date: "2025-12-10",
        time: "10:00 AM",
        status: "confirmed",
        createdAt: "2025-12-05T09:00:00Z"
      },
      event_2: {
        id: 2,
        type: "viewing",
        agentId: 5,
        agentName: "Carlos Mendoza",
        propertyId: 8,
        propertyName: "Duplex",
        inquiryId: 13,
        customerName: "Linda Garcia",
        date: "2025-12-09",
        time: "2:00 PM",
        status: "confirmed",
        createdAt: "2025-11-20T14:00:00Z"
      },
      event_3: {
        id: 3,
        type: "unavailable",
        agentId: 2,
        agentName: "Pedro Garcia",
        date: "2025-12-08",
        time: "All Day",
        status: "confirmed",
        reason: "Personal leave",
        createdAt: "2025-11-25T10:00:00Z"
      }
    };
    
    // Write data to Firebase
    database.ref('properties').set(properties);
    database.ref('users').set(users);
    database.ref('inquiries').set(inquiries);
    database.ref('calendar').set(calendar);
    
    console.log('Sample data initialized successfully!');
    showAlert('Sample data loaded successfully!', 'success');
  });
}

// Call this function when needed (e.g., from admin panel)
if (typeof window !== 'undefined') {
  window.initializeSampleData = initializeSampleData;
}
