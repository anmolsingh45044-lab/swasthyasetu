const express = require('express');
const {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/facilityController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getFacilities);
router.get('/:id', getFacilityById);
router.post('/', protect, requireAdmin, createFacility);
router.put('/:id', protect, requireAdmin, updateFacility);
router.delete('/:id', protect, requireAdmin, deleteFacility);

module.exports = router;
