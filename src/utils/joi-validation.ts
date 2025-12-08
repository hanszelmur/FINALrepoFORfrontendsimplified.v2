/**
 * Joi Validation Schemas
 * Issue 6: Comprehensive validation for all forms
 */

import Joi from 'joi';

/**
 * Email validation regex
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Philippine phone number formats:
 * - 0917-123-4567 (11 digits starting with 09)
 * - +63917-123-4567 (12 digits starting with 63)
 * - 09171234567 (without dashes)
 */
const phoneRegex = /^(\+63|0)9\d{9}$/;

/**
 * Property validation schema
 */
export const propertySchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Property name is required',
    'string.min': 'Property name must be at least 3 characters',
    'string.max': 'Property name cannot exceed 100 characters',
  }),
  address: Joi.object({
    street: Joi.string().min(5).max(200).required().messages({
      'string.empty': 'Street address is required',
      'string.min': 'Street address must be at least 5 characters',
    }),
    barangay: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Barangay is required',
    }),
    city: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'City is required',
    }),
    province: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Province is required',
    }),
    zip: Joi.string().pattern(/^\d{4}$/).required().messages({
      'string.pattern.base': 'ZIP code must be 4 digits',
      'string.empty': 'ZIP code is required',
    }),
  }).required(),
  price: Joi.number().min(100000).max(999000000).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least ₱100,000',
    'number.max': 'Price cannot exceed ₱999,000,000',
    'any.required': 'Price is required',
  }),
  status: Joi.string()
    .valid('Available', 'Reserved', 'Pending', 'Sold', 'Withdrawn')
    .required(),
  type: Joi.string()
    .valid('House', 'Condo', 'Townhouse', 'Lot', 'Commercial')
    .required()
    .messages({
      'string.empty': 'Property type is required',
    }),
  photos: Joi.array()
    .items(
      Joi.object({
        data: Joi.string().required(),
        caption: Joi.string().max(200).allow(''),
        order: Joi.number().integer().min(0),
      })
    )
    .max(10)
    .messages({
      'array.max': 'Maximum 10 photos allowed',
    }),
  description: Joi.string().min(10).max(1000).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 10 characters',
    'string.max': 'Description cannot exceed 1000 characters',
  }),
  features: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one feature is required',
  }),
  reservationFee: Joi.number().min(0).max(10000000).required().messages({
    'number.min': 'Reservation fee cannot be negative',
    'number.max': 'Reservation fee cannot exceed ₱10,000,000',
  }),
  commission: Joi.number().min(0).max(50000000).required().messages({
    'number.min': 'Commission cannot be negative',
    'number.max': 'Commission cannot exceed ₱50,000,000',
  }),
  reservationType: Joi.string().valid('fee', 'deposit').optional(),
  salePrice: Joi.number().min(0).max(999000000).optional(),
  finalCommission: Joi.number().min(0).max(50000000).optional(),
  createdAt: Joi.string().isoDate().optional(),
});

/**
 * Inquiry validation schema
 */
export const inquirySchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  propertyId: Joi.number().integer().positive().required(),
  propertyName: Joi.string().required(),
  customerName: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Customer name is required',
    'string.min': 'Customer name must be at least 2 characters',
  }),
  customerEmail: Joi.string().pattern(emailRegex).required().messages({
    'string.pattern.base': 'Please enter a valid email address',
    'string.empty': 'Email is required',
  }),
  customerPhone: Joi.string().pattern(phoneRegex).required().messages({
    'string.pattern.base':
      'Please enter a valid Philippine phone number (e.g., 0917-123-4567 or +63917-123-4567)',
    'string.empty': 'Phone number is required',
  }),
  customerAddress: Joi.string().min(10).max(300).required().messages({
    'string.empty': 'Address is required',
    'string.min': 'Address must be at least 10 characters',
  }),
  message: Joi.string().max(1000).allow(''),
  status: Joi.string().required(),
  assignedAgentId: Joi.number().integer().positive().allow(null).optional(),
  assignedAgentName: Joi.string().allow(null).optional(),
  viewingDate: Joi.string().isoDate().allow(null).optional(),
  depositAmount: Joi.number().min(0).allow(null).optional(),
  reservationExpiryDate: Joi.string().isoDate().allow(null).optional(),
  notes: Joi.string().max(1000).allow(''),
  createdAt: Joi.string().isoDate().optional(),
  updatedAt: Joi.string().isoDate().optional(),
});

/**
 * User validation schema
 */
export const userSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
  }),
  email: Joi.string().pattern(emailRegex).required().messages({
    'string.pattern.base': 'Please enter a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  role: Joi.string().valid('admin', 'agent').required(),
  phone: Joi.string().pattern(phoneRegex).required().messages({
    'string.pattern.base':
      'Please enter a valid Philippine phone number (e.g., 0917-123-4567 or +63917-123-4567)',
    'string.empty': 'Phone number is required',
  }),
  active: Joi.boolean().required(),
  createdAt: Joi.string().isoDate().optional(),
});

/**
 * Calendar event validation schema
 */
export const calendarEventSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  title: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'Event title is required',
    'string.min': 'Title must be at least 3 characters',
  }),
  type: Joi.string().valid('viewing', 'unavailable').required(),
  status: Joi.string().valid('confirmed', 'tentative', 'unavailable').required(),
  propertyId: Joi.number().integer().positive().allow(null).optional(),
  propertyName: Joi.string().allow(null).optional(),
  inquiryId: Joi.number().integer().positive().allow(null).optional(),
  agentId: Joi.number().integer().positive().required(),
  agentName: Joi.string().required(),
  customerName: Joi.string().allow(null).optional(),
  date: Joi.string().isoDate().required().messages({
    'string.empty': 'Date is required',
  }),
  startTime: Joi.string().required().messages({
    'string.empty': 'Start time is required',
  }),
  endTime: Joi.string().required().messages({
    'string.empty': 'End time is required',
  }),
  notes: Joi.string().max(500).allow(''),
  createdAt: Joi.string().isoDate().optional(),
});

/**
 * Validate data against schema
 */
export function validate<T>(
  data: T,
  schema: Joi.ObjectSchema
): { valid: boolean; errors: string[]; data?: T } {
  const result = schema.validate(data, { abortEarly: false });

  if (result.error) {
    const errors = result.error.details.map((detail) => detail.message);
    return { valid: false, errors };
  }

  return { valid: true, errors: [], data: result.value };
}

/**
 * Display validation errors in form
 */
export function displayValidationErrors(errors: string[], formId?: string): void {
  // Clear existing errors
  document.querySelectorAll('.validation-error').forEach((el) => el.remove());

  // Create error summary
  const errorList = document.createElement('div');
  errorList.className = 'alert alert-danger validation-error';
  errorList.setAttribute('role', 'alert');
  errorList.innerHTML = `
    <strong>Please fix the following errors:</strong>
    <ul class="mt-2 mb-0">
      ${errors.map((error) => `<li>${error}</li>`).join('')}
    </ul>
  `;

  // Insert error summary
  const form = formId ? document.getElementById(formId) : document.querySelector('form');
  if (form) {
    form.insertBefore(errorList, form.firstChild);
    errorList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
