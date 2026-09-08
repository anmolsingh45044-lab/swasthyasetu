const express = require('express');
const {
  createBloodRequest,
  getBloodRequests,
  getBloodRequestById,
  acceptBloodRequest,
  updateBloodRequestStatus
} = require('../controllers/bloodRequestController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/track/:requestId', getBloodRequestById);
router.post('/public', createBloodRequest);

router.use(protect);

router.get('/', getBloodRequests);
router.post('/', createBloodRequest);
router.put('/:id/accept', acceptBloodRequest);
router.put('/:id/status', requireAdmin, updateBloodRequestStatus);

module.exports = router;
