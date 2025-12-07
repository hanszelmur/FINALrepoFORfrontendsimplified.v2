// Utility Functions for TES Property

// Philippine Currency Formatting
function formatPHP(amount) {
  if (amount === null || amount === undefined) return '₱0.00';
  return '₱' + parseFloat(amount).toLocaleString('en-PH', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

// Philippine Phone Number Formatting
function formatPhoneNumber(phone) {
  if (!phone) return '';
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle +63 format
  if (cleaned.startsWith('63')) {
    cleaned = '0' + cleaned.substring(2);
  }
  
  // Format as 0917-123-4567
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return cleaned.substring(0, 4) + '-' + cleaned.substring(4, 7) + '-' + cleaned.substring(7);
  }
  
  return phone; // Return original if format doesn't match
}

// Validate Philippine Phone Number
function validatePhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  
  // Should be 11 digits starting with 09 or 10 digits starting with 63
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return true;
  }
  if (cleaned.length === 12 && cleaned.startsWith('63')) {
    return true;
  }
  
  return false;
}

// Email Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Format Date and Time
function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get time ago (e.g., "2 hours ago")
function getTimeAgo(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateString);
}

// Check if date is within range
function isDateInRange(date, startDate, endDate) {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return checkDate >= start && checkDate <= end;
}

// Current User Management
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

function checkAuth(requiredRole = null) {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '/shared/login.html';
    return false;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    alert('Access denied. You do not have permission to access this page.');
    window.location.href = '/shared/login.html';
    return false;
  }
  
  return true;
}

// Show Alert Messages
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alertDiv, container.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Show Loading Spinner
function showLoading(container) {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.id = 'loading-spinner';
  container.appendChild(spinner);
}

function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.remove();
  }
}

// Generate Unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format Address
function formatAddress(address) {
  if (!address) return '';
  
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.barangay) parts.push(address.barangay);
  if (address.city) parts.push(address.city);
  if (address.province) parts.push(address.province);
  if (address.zip) parts.push(address.zip);
  
  return parts.join(', ');
}

// Get Status Badge Class
function getStatusBadgeClass(status) {
  const statusMap = {
    'New': 'badge-info',
    'Assigned': 'badge-info',
    'In Progress': 'badge-warning',
    'Waiting - Property Reserved': 'badge-warning',
    'Viewing Scheduled': 'badge-info',
    'Viewed - Interested': 'badge-success',
    'Viewed - Not Interested': 'badge-danger',
    'Viewed - Undecided': 'badge-warning',
    'Deposit Paid': 'badge-success',
    'Successful': 'badge-success',
    'Cancelled': 'badge-danger',
    'Available': 'status-available',
    'Reserved': 'status-reserved',
    'Pending': 'status-pending',
    'Sold': 'status-sold',
    'Withdrawn': 'status-withdrawn'
  };
  
  return statusMap[status] || 'badge-secondary';
}

// Copy to Clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showAlert('Copied to clipboard!', 'success');
    }).catch(err => {
      console.error('Failed to copy:', err);
      showAlert('Failed to copy to clipboard', 'danger');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showAlert('Copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      showAlert('Failed to copy to clipboard', 'danger');
    }
    document.body.removeChild(textarea);
  }
}

// Initialize Navigation
function initNavigation(role = 'customer') {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.navbar-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Update user info if logged in
  const user = getCurrentUser();
  if (user) {
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      userInfo.textContent = `Welcome, ${user.name}`;
    }
  }
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Initialize modal close buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
});

// Export CSV
function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    showAlert('No data to export', 'warning');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showAlert('CSV exported successfully', 'success');
}
