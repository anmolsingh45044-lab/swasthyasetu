const express = require('express');
const {
  getSummary,
  getBloodByGroup,
  getRequestsOverTime,
  getRequestStatusBreakdown,
  getBedAvailability,
  getFacilityDistribution
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/summary', getSummary);
router.get('/blood-by-group', getBloodByGroup);
router.get('/requests-over-time', getRequestsOverTime);
router.get('/request-status', getRequestStatusBreakdown);
router.get('/bed-availability', getBedAvailability);
router.get('/facility-distribution', getFacilityDistribution);

module.exports = router;
