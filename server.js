/**
 * Simple Backend Server for TES Property System
 * Serves JSON files from data/ folder and handles GET/POST requests
 * Run with: node server.js
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Allow large base64 images
app.use(express.static('public'));
app.use(express.static('dist'));

/**
 * Helper: Read JSON file
 */
async function readJSONFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read ${filename}`);
  }
}

/**
 * Helper: Write JSON file
 */
async function writeJSONFile(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const jsonData = {
      ...data,
      _metadata: {
        ...data._metadata,
        lastModified: new Date().toISOString(),
        recordCount: data.data?.length || 0,
      },
    };
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw new Error(`Failed to write ${filename}`);
  }
}

/**
 * Helper: Log activity
 */
async function logActivity(action, section, note, details = {}) {
  try {
    const log = await readJSONFile('activity-log.json');
    const newEntry = {
      timestamp: new Date().toISOString(),
      action,
      section,
      note,
      details,
    };
    log.data.push(newEntry);
    await writeJSONFile('activity-log.json', log);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const data = await readJSONFile('properties.json');
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single property
app.get('/api/properties/:id', async (req, res) => {
  try {
    const data = await readJSONFile('properties.json');
    const property = data.data.find((p) => p.id === parseInt(req.params.id));
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add property
app.post('/api/properties', async (req, res) => {
  try {
    const properties = await readJSONFile('properties.json');
    const newProperties = await readJSONFile('new-properties.json');
    
    // Generate property code if not provided
    const year = new Date().getFullYear();
    const propertyCode = req.body.propertyCode || `PROP-${year}-${String(Date.now()).slice(-4)}`;
    
    // Calculate price per sqm if not provided
    const pricePerSqm = req.body.pricePerSqm || 
      (req.body.price && req.body.squareMeters ? Math.round(req.body.price / req.body.squareMeters) : 0);
    
    const now = new Date().toISOString();
    const newProperty = {
      ...req.body,
      id: Date.now(),
      propertyCode,
      pricePerSqm,
      createdAt: now,
      // Ensure metadata exists
      metadata: {
        ...req.body.metadata,
        dateAdded: req.body.metadata?.dateAdded || now,
        lastUpdated: now
      }
    };
    
    properties.data.push(newProperty);
    newProperties.data.push(newProperty);
    
    await writeJSONFile('properties.json', properties);
    await writeJSONFile('new-properties.json', newProperties);
    
    await logActivity(
      'ADD_PROPERTY',
      'Properties',
      'Property added via admin portal',
      { 
        propertyCode: newProperty.propertyCode,
        propertyName: newProperty.name || newProperty.title,
        price: newProperty.price,
        addedBy: newProperty.metadata?.addedBy
      }
    );
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property: newProperty
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update property
app.put('/api/properties/:id', async (req, res) => {
  try {
    const properties = await readJSONFile('properties.json');
    const index = properties.data.findIndex((p) => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const oldProperty = properties.data[index];
    const now = new Date().toISOString();
    
    // Preserve original metadata.dateAdded and update lastUpdated
    const updatedProperty = {
      ...properties.data[index],
      ...req.body,
      metadata: {
        ...req.body.metadata,
        dateAdded: oldProperty.metadata?.dateAdded || req.body.metadata?.dateAdded || now,
        lastUpdated: now,
        updatedBy: req.body.metadata?.updatedBy || 'Admin User'
      }
    };
    
    // Recalculate price per sqm if price or sqm changed
    if (updatedProperty.price && updatedProperty.squareMeters) {
      updatedProperty.pricePerSqm = Math.round(updatedProperty.price / updatedProperty.squareMeters);
    }
    
    properties.data[index] = updatedProperty;
    
    await writeJSONFile('properties.json', properties);
    
    await logActivity(
      'UPDATE_PROPERTY',
      'Properties',
      'Property updated via admin portal',
      { 
        propertyCode: updatedProperty.propertyCode,
        propertyName: updatedProperty.name || updatedProperty.title,
        changes: Object.keys(req.body),
        oldStatus: oldProperty.status,
        newStatus: updatedProperty.status,
        updatedBy: updatedProperty.metadata?.updatedBy
      }
    );
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const properties = await readJSONFile('properties.json');
    const property = properties.data.find((p) => p.id === parseInt(req.params.id));
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    properties.data = properties.data.filter((p) => p.id !== parseInt(req.params.id));
    await writeJSONFile('properties.json', properties);
    
    await logActivity(
      'DELETE_PROPERTY',
      'Properties',
      'Property deleted by admin',
      { propertyName: property.name }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    const data = await readJSONFile('inquiries.json');
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await readJSONFile('inquiries.json');
    const newInquiries = await readJSONFile('new-inquiries.json');
    
    const newInquiry = {
      ...req.body,
      id: Date.now(),
      status: 'New',
      assignedAgentId: null,
      assignedAgentName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    inquiries.data.push(newInquiry);
    newInquiries.data.push(newInquiry);
    
    await writeJSONFile('inquiries.json', inquiries);
    await writeJSONFile('new-inquiries.json', newInquiries);
    
    await logActivity(
      'NEW_INQUIRY',
      'Inquiries',
      'Customer submitted new inquiry',
      {
        customerName: newInquiry.customerName,
        propertyName: newInquiry.propertyName,
        customerEmail: newInquiry.customerEmail,
      }
    );
    
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inquiry
app.put('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiries = await readJSONFile('inquiries.json');
    const index = inquiries.data.findIndex((i) => i.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    
    const oldInquiry = inquiries.data[index];
    inquiries.data[index] = {
      ...inquiries.data[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    await writeJSONFile('inquiries.json', inquiries);
    
    // Remove from new inquiries if status changed from New
    if (oldInquiry.status === 'New' && req.body.status !== 'New') {
      const newInquiries = await readJSONFile('new-inquiries.json');
      newInquiries.data = newInquiries.data.filter((i) => i.id !== parseInt(req.params.id));
      await writeJSONFile('new-inquiries.json', newInquiries);
    }
    
    await logActivity(
      'UPDATE_INQUIRY',
      'Inquiries',
      `Inquiry status changed from ${oldInquiry.status} to ${inquiries.data[index].status}`,
      {
        inquiryId: inquiries.data[index].id,
        customerName: inquiries.data[index].customerName,
        propertyName: inquiries.data[index].propertyName,
        oldStatus: oldInquiry.status,
        newStatus: inquiries.data[index].status,
      }
    );
    
    res.json(inquiries.data[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const data = await readJSONFile('users.json');
    // Don't send passwords to client
    const users = data.data.map(({ password, ...user }) => user);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (agent)
app.post('/api/users', async (req, res) => {
  try {
    const users = await readJSONFile('users.json');
    const newAgents = await readJSONFile('new-agents.json');
    
    // Validate duplicate email
    const emailExists = users.data.some(
      (u) => u.email.toLowerCase() === req.body.email.toLowerCase()
    );
    
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Generate new ID (max + 1)
    const maxId = users.data.length > 0 
      ? Math.max(...users.data.map(u => u.id || 0))
      : 0;
    
    const newUser = {
      ...req.body,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to both files
    users.data.push(newUser);
    newAgents.data.push(newUser);
    
    // Save to JSON files
    await writeJSONFile('users.json', users);
    await writeJSONFile('new-agents.json', newAgents);
    
    // Log activity
    await logActivity(
      'ADD_AGENT',
      'Users',
      'New agent registered via Super Admin portal',
      {
        agentName: newUser.name,
        email: newUser.email,
        employeeId: newUser.employmentInfo?.employeeId,
        position: newUser.employmentInfo?.position,
        addedBy: newUser.employmentInfo?.addedBy
      }
    );
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const data = await readJSONFile('users.json');
    const user = data.data.find(
      (u) => u.email === req.body.email && u.password === req.body.password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      await logActivity(
        'USER_LOGIN',
        'Authentication',
        `User logged in: ${user.name}`,
        { email: user.email, role: user.role }
      );
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all calendar events
app.get('/api/calendar', async (req, res) => {
  try {
    const data = await readJSONFile('calendar-events.json');
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add calendar event
app.post('/api/calendar', async (req, res) => {
  try {
    const events = await readJSONFile('calendar-events.json');
    
    const newEvent = {
      ...req.body,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    
    events.data.push(newEvent);
    await writeJSONFile('calendar-events.json', events);
    
    await logActivity(
      'ADD_CALENDAR_EVENT',
      'Calendar',
      'Calendar event scheduled',
      {
        eventType: newEvent.type,
        agentName: newEvent.agentName,
        date: newEvent.date,
      }
    );
    
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update calendar event
app.put('/api/calendar/:id', async (req, res) => {
  try {
    const events = await readJSONFile('calendar-events.json');
    const index = events.data.findIndex((e) => e.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    events.data[index] = { ...events.data[index], ...req.body };
    await writeJSONFile('calendar-events.json', events);
    
    res.json(events.data[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete calendar event
app.delete('/api/calendar/:id', async (req, res) => {
  try {
    const events = await readJSONFile('calendar-events.json');
    events.data = events.data.filter((e) => e.id !== parseInt(req.params.id));
    await writeJSONFile('calendar-events.json', events);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get activity log
app.get('/api/activity-log', async (req, res) => {
  try {
    const data = await readJSONFile('activity-log.json');
    // Return most recent first
    const sorted = [...data.data].reverse();
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize data (load sample data)
app.post('/api/initialize', async (req, res) => {
  try {
    // This endpoint would load sample data if needed
    // For now, just return success
    res.json({ success: true, message: 'System already initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search properties
app.get('/api/properties/search', async (req, res) => {
  try {
    const { query, minPrice, maxPrice, type, status } = req.query;
    const data = await readJSONFile('properties.json');
    
    let results = data.data;
    
    // Filter by search query (name or address)
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.address.street.toLowerCase().includes(lowerQuery) ||
          p.address.city.toLowerCase().includes(lowerQuery) ||
          p.address.province.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by price range
    if (minPrice) {
      results = results.filter((p) => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      results = results.filter((p) => p.price <= parseInt(maxPrice));
    }
    
    // Filter by type
    if (type) {
      results = results.filter((p) => p.type === type);
    }
    
    // Filter by status
    if (status) {
      results = results.filter((p) => p.status === status);
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get new properties count
app.get('/api/new-properties/count', async (req, res) => {
  try {
    const data = await readJSONFile('new-properties.json');
    res.json({ count: data.data.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get new inquiries count
app.get('/api/new-inquiries/count', async (req, res) => {
  try {
    const data = await readJSONFile('new-inquiries.json');
    res.json({ count: data.data.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update inquiries
app.post('/api/inquiries/bulk-update', async (req, res) => {
  try {
    const { ids, updates } = req.body;
    const inquiries = await readJSONFile('inquiries.json');
    
    let updatedCount = 0;
    ids.forEach((id) => {
      const index = inquiries.data.findIndex((i) => i.id === id);
      if (index !== -1) {
        inquiries.data[index] = {
          ...inquiries.data[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        updatedCount++;
      }
    });
    
    await writeJSONFile('inquiries.json', inquiries);
    
    await logActivity(
      'BULK_UPDATE_INQUIRIES',
      'Inquiries',
      `Bulk updated ${updatedCount} inquiries`,
      { inquiryIds: ids, updates }
    );
    
    res.json({ success: true, updatedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  TES Property Server - JSON File Storage Backend         ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}             ║
║  Data directory: ${DATA_DIR}                              ║
║  Status: ✓ Ready to serve requests                       ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  process.exit(0);
});
