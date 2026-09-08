const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    requestType: { type: String, enum: ['BloodRequest', 'ResourceRequest'], required: true },
    request: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'requestType' },
    pickupFacility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
    destination: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'Pending', 'Assigned', 'Picked Up', 'In Transit', 'Delivered'],
      default: 'PENDING'
    },
    estimatedDeliveryTime: { type: Date },
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
