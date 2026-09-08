const express = require('express');
const {
  createResourceRequest,
  getResourceRequests,
  getResourceRequestById,
  updateResourceRequestStatus,
  getDeliveries,
  getDeliveryById,
  updateDeliveryStatus
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/requests/track/:requestId', getResourceRequestById);
router.post('/requests/public', createResourceRequest);

router.use(protect);

// Resource requests (bed/oxygen/diagnostics/medicine)
router.get('/requests', getResourceRequests);
router.post('/requests', createResourceRequest);
router.put('/requests/:id/status', requireAdmin, updateResourceRequestStatus);

// Deliveries
router.get('/', getDeliveries);
router.get('/:id', getDeliveryById);
router.put('/:id/status', requireAdmin, updateDeliveryStatus);

module.exports = router;
