const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => `BK${Date.now().toString(36).toUpperCase()}${uuidv4().slice(0, 4).toUpperCase()}`,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    timeSlot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      required: true,
    },
    address: { type: addressSchema, required: true },
    notes: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    cancellationReason: { type: String },
    deliveryOtp: {
      type: String,
      select: false,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    isOtpVerified: { type: Boolean, default: false },
    pricing: {
      basePrice: { type: Number, required: true },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      review: { type: String, maxlength: 300 },
      ratedAt: { type: Date },
    },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
bookingSchema.index({ customer: 1, status: 1, scheduledAt: -1 });
bookingSchema.index({ vendor: 1, status: 1, scheduledAt: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
