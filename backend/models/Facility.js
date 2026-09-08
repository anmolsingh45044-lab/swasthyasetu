const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Government Hospital', 'Private Hospital', 'Primary Health Centre', 'Blood Bank', 'Community Health Centre'],
      default: 'Government Hospital'
    },
    services: [{ type: String }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
    phone: { type: String },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

facilitySchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Facility', facilitySchema);
