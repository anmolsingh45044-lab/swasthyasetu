const express = require('express');
const { getBeds, upsertBed, deleteBed } = require('../controllers/bedController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getBeds);
router.post('/', protect, requireAdmin, upsertBed);
router.delete('/:id', protect, requireAdmin, deleteBed);

module.exports = router;
