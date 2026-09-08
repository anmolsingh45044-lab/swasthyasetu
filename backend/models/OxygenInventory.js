const mongoose = require('mongoose');

const oxygenInventorySchema = new mongoose.Schema(
  {
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    cylinderType: { type: String, enum: ['B-Type', 'D-Type', 'Jumbo', 'Liquid Oxygen'], default: 'D-Type' },
    availableCylinders: { type: Number, required: true, min: 0 },
    capacity: { type: String },
    status: { type: String, enum: ['Available', 'Low', 'Out of Stock'], default: 'Available' },
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

oxygenInventorySchema.pre('save', function setStatus(next) {
  if (this.availableCylinders <= 0) this.status = 'Out of Stock';
  else if (this.availableCylinders <= 5) this.status = 'Low';
  else this.status = 'Available';
  next();
});

module.exports = mongoose.model('OxygenInventory', oxygenInventorySchema);
