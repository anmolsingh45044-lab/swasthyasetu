const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('./User');

const bloodInventorySchema = new mongoose.Schema(
  {
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true },
    units: { type: Number, required: true, min: 0, default: 0 },
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

bloodInventorySchema.index({ facility: 1, bloodGroup: 1 }, { unique: true });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
