const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema(
  {
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    bedType: {
      type: String,
      enum: ['General', 'ICU', 'Emergency', 'Maternal', 'Pediatric'],
      required: true
    },
    totalBeds: { type: Number, required: true, min: 0 },
    availableBeds: { type: Number, required: true, min: 0 },
    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

bedSchema.index({ facility: 1, bedType: 1 }, { unique: true });

module.exports = mongoose.model('Bed', bedSchema);
