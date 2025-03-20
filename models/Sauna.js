const mongoose = require('mongoose');

const SaunaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this sauna"],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
      maxlength: [200, "Address cannot be more than 200 characters"],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number cannot be more than 20 characters"],
    },
    website: {
      type: String,
      maxlength: [200, "Website URL cannot be more than 200 characters"],
    },
    rating: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },
    photoUrl: {
      type: String,
      default: "/images/placeholder-sauna.jpg",
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    province: {
      type: String,
      required: [true, "Please specify a province/state"],
      lowercase: true,
    },
    city: {
      type: String,
      required: [true, "Please specify a city"],
      lowercase: true,
    },
    country: {
      type: String,
      default: "Canada",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    workingHours: {
      type: String,
      maxlength: [200, "Working hours cannot be more than 200 characters"],
    },
    popularTimes: {
      type: String,
      maxlength: [200, "Popular times cannot be more than 200 characters"],
    },
    type: {
      type: String,
      enum: ["Finnish", "Infrared", "Steam", "Outdoor", "Other"],
      default: "Other",
    },
    amenities: {
      type: [String],
      default: [],
    },
    featured: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    postalCode: {
      type: String,
    },
    email: {
      type: String,
    },
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    hours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    traditional: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    wood: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    infrared: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    hot_tub: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    cold_plunge: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    steam: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    private: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    public: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    mobile: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
    gay: {
      type: String,
      enum: ['Y', 'N', ''],
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'saunas'
  }
);

// Add geospatial index for location-based queries
SaunaSchema.index({ location: "2dsphere" });

// Update the updatedAt field on save
SaunaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export for both CommonJS and ES modules
module.exports = mongoose.models.Sauna || mongoose.model("Sauna", SaunaSchema, 'saunas'); 