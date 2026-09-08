const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('./User');

const bloodRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true, sparse: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    patientName: { type: String, default: 'Patient' },
    mobileNumber: { type: String, default: '' },
    deliveryAddress: { type: String, default: '' },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
    bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true },
    units: { type: Number, required: true, min: 1 },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Critical', 'Emergency', 'PENDING', 'APPROVED', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED'],
      default: 'Urgent'
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED', 'Pending', 'Accepted', 'Rejected', 'Fulfilled', 'Cancelled'],
      default: 'PENDING'
    },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: String },
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
