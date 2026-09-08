const express = require('express');
const { getOxygen, upsertOxygen, deleteOxygen } = require('../controllers/oxygenController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getOxygen);
router.post('/', protect, requireAdmin, upsertOxygen);
router.delete('/:id', protect, requireAdmin, deleteOxygen);

module.exports = router;
