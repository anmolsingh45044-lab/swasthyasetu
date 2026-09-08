const Delivery = require('../models/Delivery');
const ResourceRequest = require('../models/ResourceRequest');
const BloodRequest = require('../models/BloodRequest');
const { createNotification } = require('../services/notificationService');

const normalizeRequestStatus = (status) => {
  const map = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    PICKED_UP: 'PICKED_UP',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    REJECTED: 'REJECTED',
    Pending: 'PENDING',
    Accepted: 'APPROVED',
    Rejected: 'REJECTED',
    Fulfilled: 'DELIVERED',
    Cancelled: 'REJECTED'
  };
  return map[status] || status;
};

const normalizeDeliveryStatus = (status) => {
  const map = {
    PENDING: 'PENDING',
    ASSIGNED: 'ASSIGNED',
    PICKED_UP: 'PICKED_UP',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    Pending: 'PENDING',
    Assigned: 'ASSIGNED',
    'Picked Up': 'PICKED_UP',
    'In Transit': 'OUT_FOR_DELIVERY',
    Delivered: 'DELIVERED'
  };
  return map[status] || status;
};

const generateRequestId = async () => {
  const year = new Date().getFullYear();
  let requestId = `SS-${year}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  while (await ResourceRequest.exists({ requestId })) {
    requestId = `SS-${year}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  }
  return requestId;
};

// --- Resource requests (Bed / Oxygen / Diagnostics / Medicine) ---

const createResourceRequest = async (req, res, next) => {
  try {
    const { facility, resourceType, details, quantity, urgency, patientName, mobileNumber, deliveryAddress, emergencyLevel } = req.body;
    if (!resourceType) {
      return res.status(400).json({ success: false, message: 'resourceType is required.' });
    }

    const request = await ResourceRequest.create({
      requestId: await generateRequestId(),
      requestedBy: req.user?._id || null,
      facility: facility || null,
      patientName: patientName || req.user?.name || 'Patient',
      mobileNumber: mobileNumber || req.user?.phone || '',
      deliveryAddress: deliveryAddress || req.user?.location?.address || '',
      resourceType,
      details,
      quantity: Number(quantity || 1),
      urgency: urgency || emergencyLevel || 'Urgent',
      status: 'PENDING'
    });

    if (req.user) {
      await createNotification({
        user: req.user._id,
        title: `${resourceType} request submitted`,
        message: `Your ${resourceType.toLowerCase()} request has been submitted and is pending.`,
        type: 'info'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Request Created Successfully',
      requestId: request.requestId,
      request
    });
  } catch (err) {
    next(err);
  }
};

const getResourceRequests = async (req, res, next) => {
  try {
    const { mine, status, resourceType } = req.query;
    const filter = {};
    if (mine === 'true' && req.user) filter.requestedBy = req.user._id;
    if (status) filter.status = normalizeRequestStatus(status);
    if (resourceType) filter.resourceType = resourceType;

    const requests = await ResourceRequest.find(filter)
      .populate('facility', 'name city')
      .populate('requestedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

const getResourceRequestById = async (req, res, next) => {
  try {
    const request = await ResourceRequest.findOne({ requestId: req.params.requestId })
      .populate('facility', 'name city')
      .populate('requestedBy', 'name');

    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

const updateResourceRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const normalized = normalizeRequestStatus(status);
    const allowed = ['PENDING', 'APPROVED', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED'];
    if (!allowed.includes(normalized)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const request = await ResourceRequest.findByIdAndUpdate(req.params.id, { status: normalized }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (normalized === 'APPROVED') {
      await Delivery.findOneAndUpdate(
        { request: request._id, requestType: 'ResourceRequest' },
        {
          $set: {
            pickupFacility: request.facility,
            destination: request.deliveryAddress || 'Patient residence',
            status: 'ASSIGNED',
            estimatedDeliveryTime: new Date(Date.now() + 10 * 60 * 1000)
          }
        },
        { upsert: true, new: true }
      );
    }

    if (request.requestedBy) {
      await createNotification({
        user: request.requestedBy,
        title: 'Request update',
        message: `Your ${request.resourceType.toLowerCase()} request status changed to: ${normalized}.`,
        type: normalized === 'DELIVERED' ? 'success' : 'info'
      });
    }

    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// --- Deliveries ---

const getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find()
      .populate('pickupFacility', 'name city')
      .populate({
        path: 'request',
        populate: { path: 'requestedBy', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: deliveries.length, deliveries });
  } catch (err) {
    next(err);
  }
};

const getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('pickupFacility', 'name city')
      .populate('request');
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found.' });
    res.json({ success: true, delivery });
  } catch (err) {
    next(err);
  }
};

const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, estimatedDeliveryTime } = req.body;
    const normalized = normalizeDeliveryStatus(status);
    const allowed = ['PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    if (!allowed.includes(normalized)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status: normalized, ...(estimatedDeliveryTime ? { estimatedDeliveryTime } : {}) },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found.' });

    const RequestModel = delivery.requestType === 'BloodRequest' ? BloodRequest : ResourceRequest;
    const request = await RequestModel.findById(delivery.request);
    if (request) {
      const statusMap = {
        PENDING: 'PENDING',
        ASSIGNED: 'READY_FOR_PICKUP',
        PICKED_UP: 'PICKED_UP',
        OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
        DELIVERED: 'DELIVERED'
      };
      request.status = statusMap[normalized] || request.status;
      await request.save();

      if (request.requestedBy) {
        await createNotification({
          user: request.requestedBy,
          title: 'Delivery update',
          message: `Your delivery is now: ${normalized}.`,
          type: normalized === 'DELIVERED' ? 'success' : 'info'
        });
      }
    }

    res.json({ success: true, delivery });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createResourceRequest,
  getResourceRequests,
  getResourceRequestById,
  updateResourceRequestStatus,
  getDeliveries,
  getDeliveryById,
  updateDeliveryStatus
};
