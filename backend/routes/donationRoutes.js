const express = require('express');
const { createDonation, getMyDonations, updateDonationStatus } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createDonation);
router.get('/mine', getMyDonations);
router.put('/:id/status', updateDonationStatus);

module.exports = router;
