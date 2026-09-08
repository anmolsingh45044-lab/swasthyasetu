const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('./User');

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
    bloodRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', default: null },
    bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true },
    units: { type: Number, default: 1 },
    donationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
