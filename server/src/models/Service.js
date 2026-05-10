const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String },          // emoji or URL
    color: { type: String },         // hex for card bg
    description: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);



const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    basePrice: { type: Number, required: true, min: 0 },
    priceUnit: {
      type: String,
      enum: ['fixed', 'per_hour', 'per_sqft'],
      default: 'fixed',
    },
    estimatedDuration: { type: Number }, // in minutes
    image: { type: String },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Category = mongoose.model('Category', categorySchema);
const Service = mongoose.model('Service', serviceSchema);
module.exports = { Category, Service };
