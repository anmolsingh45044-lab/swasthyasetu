const mongoose = require('mongoose');

const resourceRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true, sparse: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    patientName: { type: String, default: 'Patient' },
    mobileNumber: { type: String, default: '' },
    deliveryAddress: { type: String, default: '' },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
    resourceType: {
      type: String,
      enum: ['Bed', 'Oxygen', 'Diagnostics', 'Medicine', 'Oxygen Cylinder'],
      required: true
    },
    details: { type: String },
    quantity: { type: Number, default: 1 },
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
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResourceRequest', resourceRequestSchema);
