const express = require('express');
const { getBloodInventory, upsertBloodInventory, deleteBloodInventory } = require('../controllers/bloodController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getBloodInventory);
router.post('/', protect, requireAdmin, upsertBloodInventory);
router.delete('/:id', protect, requireAdmin, deleteBloodInventory);

module.exports = router;
