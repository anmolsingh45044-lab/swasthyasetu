const User = require('../models/User');
const { buildAuthResponse } = require('../services/authService');

// @desc Register new user. Role is ALWAYS forced to 'user' here regardless of
// what the client sends - admin accounts can only be created directly in MongoDB.
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, bloodGroup } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      bloodGroup,
      role: 'user', // never trust client-supplied role
      activeMode: 'patient'
    });

    res.status(201).json({ success: true, ...buildAuthResponse(user) });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({ success: true, ...buildAuthResponse(user) });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc Switch between Patient and Donor mode ONLY. This can never touch
// `role`, so a normal user can never elevate themselves to admin this way.
const switchMode = async (req, res, next) => {
  try {
    const { mode } = req.body;
    if (!['patient', 'donor'].includes(mode)) {
      return res.status(400).json({ success: false, message: "Mode must be 'patient' or 'donor'." });
    }

    req.user.activeMode = mode;
    await req.user.save();

    res.json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'bloodGroup', 'location', 'donorProfile'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });
    // role is intentionally excluded from allowedFields - it can never be
    // updated through this endpoint no matter what the client sends.
    await req.user.save();
    res.json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, switchMode, updateProfile };
