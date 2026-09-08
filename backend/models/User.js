const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },

    // Privileged role - can ONLY be changed directly in the database by an existing admin.
    // Never derived from client input on registration or profile update.
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Non-privileged "mode" - freely toggled by the user themselves via the app.
    // This is intentionally separate from `role` so Patient <-> Donor switching
    // can never escalate into admin access.
    activeMode: { type: String, enum: ['patient', 'donor'], default: 'patient' },

    bloodGroup: { type: String, enum: BLOOD_GROUPS },
    location: {
      address: String,
      city: String,
      state: String,
      lat: Number,
      lng: Number
    },

    donorProfile: {
      isAvailable: { type: Boolean, default: true },
      lastDonationDate: Date,
      totalDonations: { type: Number, default: 0 }
    },

    isDemo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
module.exports.BLOOD_GROUPS = BLOOD_GROUPS;
