const BloodRequest = require('../models/BloodRequest');
const Delivery = require('../models/Delivery');
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

const generateRequestId = async () => {
  const year = new Date().getFullYear();
  let requestId = `SS-${year}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  while (await BloodRequest.exists({ requestId })) {
    requestId = `SS-${year}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  }
  return requestId;
};

const createBloodRequest = async (req, res, next) => {
  try {
    const { facility, bloodGroup, units, quantity, urgency, notes, patientName, mobileNumber, deliveryAddress, emergencyLevel } = req.body;
    if (!bloodGroup || !(units || quantity)) {
      return res.status(400).json({ success: false, message: 'bloodGroup and units are required.' });
    }

    const request = await BloodRequest.create({
      requestId: await generateRequestId(),
      requestedBy: req.user?._id || null,
      facility: facility || null,
      patientName: patientName || req.user?.name || 'Patient',
      mobileNumber: mobileNumber || req.user?.phone || '',
      deliveryAddress: deliveryAddress || req.user?.location?.address || '',
      bloodGroup,
      units: Number(units || quantity),
      urgency: urgency || emergencyLevel || 'Urgent',
      notes,
      status: 'PENDING'
    });

    if (req.user) {
      await createNotification({
        user: req.user._id,
        title: 'Blood request submitted',
        message: `Your request for ${request.units} unit(s) of ${request.bloodGroup} blood has been submitted.`,
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

const getBloodRequests = async (req, res, next) => {
  try {
    const { mine, status, bloodGroup } = req.query;
    const filter = {};
    if (mine === 'true' && req.user) filter.requestedBy = req.user._id;
    if (status) filter.status = normalizeRequestStatus(status);
    if (bloodGroup) filter.bloodGroup = bloodGroup;

    const requests = await BloodRequest.find(filter)
      .populate('facility', 'name city')
      .populate('requestedBy', 'name')
      .populate('acceptedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

const getBloodRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findOne({ requestId: req.params.requestId })
      .populate('facility', 'name city')
      .populate('requestedBy', 'name')
      .populate('acceptedBy', 'name');

    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

const acceptBloodRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (normalizeRequestStatus(request.status) !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'This request is no longer pending.' });
    }

    request.status = 'APPROVED';
    request.acceptedBy = req.user._id;
    await request.save();

    await Delivery.findOneAndUpdate(
      { request: request._id, requestType: 'BloodRequest' },
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

    await createNotification({
      user: request.requestedBy,
      title: 'Blood request accepted',
      message: 'Your blood request has been approved and is being arranged for pickup.',
      type: 'success'
    });

    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

const updateBloodRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const normalized = normalizeRequestStatus(status);
    const allowed = ['PENDING', 'APPROVED', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED'];
    if (!allowed.includes(normalized)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const request = await BloodRequest.findByIdAndUpdate(req.params.id, { status: normalized }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (request.requestedBy) {
      await createNotification({
        user: request.requestedBy,
        title: 'Blood request update',
        message: `Your blood request status changed to: ${normalized}.`,
        type: normalized === 'DELIVERED' ? 'success' : 'info'
      });
    }

    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBloodRequest, getBloodRequests, getBloodRequestById, acceptBloodRequest, updateBloodRequestStatus };
