const express = require('express');
const { register, login, getMe, switchMode, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/switch-mode', protect, switchMode);
router.put('/profile', protect, updateProfile);

module.exports = router;
