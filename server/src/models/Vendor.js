const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 0, max: 6 }, // 0=Sun, 6=Sat
    startTime: { type: String }, // "09:00"
    endTime: { type: String },   // "18:00"
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    experience: { type: Number, default: 0 }, // years
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    cities: [{ type: String }],
    hourlyRate: { type: Number, min: 0 },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    totalJobsCompleted: { type: Number, default: 0 },
    availabilitySlots: [availabilitySlotSchema],
    documents: {
      idProof: { type: String },
      addressProof: { type: String },
      certificate: { type: String },
    },
    bankDetails: {
      accountNumber: { type: String, select: false },
      ifsc: { type: String, select: false },
      accountHolder: { type: String, select: false },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

vendorSchema.index({ services: 1, isAvailable: 1, isActive: 1 });
vendorSchema.index({ cities: 1, isAvailable: 1, isActive: 1 });
vendorSchema.index({ avgRating: -1 });

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
