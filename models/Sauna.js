import mongoose from "mongoose";

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
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

// Add geospatial index for location-based queries
SaunaSchema.index({ location: "2dsphere" });

export default mongoose.models.Sauna || mongoose.model("Sauna", SaunaSchema); 