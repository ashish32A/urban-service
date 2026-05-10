/**
 * @file shared/types.js
 * JSDoc type definitions used across client and server.
 * Acts as the single source of truth for all domain shapes.
 */

// ─── User ─────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Address
 * @property {string} line1
 * @property {string} city
 * @property {string} [state]
 * @property {string} pincode
 * @property {boolean} [isDefault]
 */

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} phone
 * @property {'customer'|'vendor'|'admin'} role
 * @property {string} [city]
 * @property {string} [profilePicture]
 * @property {Address[]} [addresses]
 * @property {boolean} isPhoneVerified
 * @property {boolean} isEmailVerified
 * @property {boolean} isActive
 * @property {boolean} isProfileComplete
 * @property {Date} [lastLogin]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

// ─── Vendor ───────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} AvailabilitySlot
 * @property {number} day - 0=Sun, 6=Sat
 * @property {string} startTime - e.g. "09:00"
 * @property {string} endTime   - e.g. "18:00"
 */

/**
 * @typedef {Object} Vendor
 * @property {string} _id
 * @property {User|string} user
 * @property {string} [businessName]
 * @property {string} [bio]
 * @property {number} experience - years
 * @property {(Service|string)[]} services
 * @property {string[]} cities
 * @property {number} [hourlyRate]
 * @property {string} [avatar]
 * @property {boolean} isVerified
 * @property {boolean} isAvailable
 * @property {boolean} isActive
 * @property {number} avgRating
 * @property {number} totalRatings
 * @property {number} totalJobsCompleted
 * @property {AvailabilitySlot[]} [availabilitySlots]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

// ─── Category ─────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {string} [icon]
 * @property {string} [color]
 * @property {string} [description]
 * @property {boolean} isActive
 * @property {number} sortOrder
 */

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Service
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {string} [description]
 * @property {Category|string} category
 * @property {number} basePrice
 * @property {'fixed'|'per_hour'|'per_sqft'} priceUnit
 * @property {number} [estimatedDuration] - minutes
 * @property {string} [image]
 * @property {string[]} [tags]
 * @property {boolean} isActive
 * @property {number} avgRating
 * @property {number} totalBookings
 * @property {Date} createdAt
 */

// ─── Booking ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} BookingPricing
 * @property {number} basePrice
 * @property {number} tax
 * @property {number} discount
 * @property {number} total
 */

/**
 * @typedef {Object} BookingRating
 * @property {number} score - 1-5
 * @property {string} [review]
 * @property {Date} ratedAt
 */

/**
 * @typedef {'pending'|'confirmed'|'in_progress'|'completed'|'cancelled'} BookingStatus
 * @typedef {'morning'|'afternoon'|'evening'} TimeSlot
 */

/**
 * @typedef {Object} Booking
 * @property {string} _id
 * @property {string} bookingId - Human-readable ID e.g. BK1A2B3C4D
 * @property {User|string} customer
 * @property {Vendor|string} [vendor]
 * @property {Service|string} service
 * @property {Date} scheduledAt
 * @property {TimeSlot} timeSlot
 * @property {Address} address
 * @property {string} [notes]
 * @property {BookingStatus} status
 * @property {string} [cancellationReason]
 * @property {boolean} isOtpVerified
 * @property {BookingPricing} pricing
 * @property {BookingRating} [rating]
 * @property {Date} [confirmedAt]
 * @property {Date} [completedAt]
 * @property {Date} [cancelledAt]
 * @property {Date} createdAt
 */

// ─── API Response shapes ───────────────────────────────────────────────────────

/**
 * @template T
 * @typedef {Object} ApiSuccess
 * @property {true} success
 * @property {T} [data]
 */

/**
 * @typedef {Object} ApiError
 * @property {false} success
 * @property {{ code: string, message: string, details?: any }} error
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {any[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} pages
 */

module.exports = {};
