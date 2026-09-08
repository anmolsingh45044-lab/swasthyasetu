const User = require('../models/User');
const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const Bed = require('../models/Bed');
const OxygenInventory = require('../models/OxygenInventory');
const Delivery = require('../models/Delivery');
const Facility = require('../models/Facility');

const getSummary = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeDonors,
      bloodUnitsAgg,
      bloodRequests,
      bedsAgg,
      oxygenAgg,
      pendingDeliveries
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ activeMode: 'donor', 'donorProfile.isAvailable': true }),
      BloodInventory.aggregate([{ $group: { _id: null, total: { $sum: '$units' } } }]),
      BloodRequest.countDocuments(),
      Bed.aggregate([{ $group: { _id: null, total: { $sum: '$availableBeds' } } }]),
      OxygenInventory.aggregate([{ $group: { _id: null, total: { $sum: '$availableCylinders' } } }]),
      Delivery.countDocuments({ status: { $ne: 'Delivered' } })
    ]);

    res.json({
      success: true,
      summary: {
        totalUsers,
        activeDonors,
        bloodUnitsAvailable: bloodUnitsAgg[0]?.total || 0,
        bloodRequests,
        bedsAvailable: bedsAgg[0]?.total || 0,
        oxygenCylinders: oxygenAgg[0]?.total || 0,
        pendingDeliveries
      }
    });
  } catch (err) {
    next(err);
  }
};

const getBloodByGroup = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.aggregate([
      { $group: { _id: '$bloodGroup', units: { $sum: '$units' } } },
      { $sort: { _id: 1 } }
    ]);
    const requests = await BloodRequest.aggregate([
      { $group: { _id: '$bloodGroup', requests: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, inventory, requests });
  } catch (err) {
    next(err);
  }
};

const getRequestsOverTime = async (req, res, next) => {
  try {
    const data = await BloodRequest.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getRequestStatusBreakdown = async (req, res, next) => {
  try {
    const data = await BloodRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getBedAvailability = async (req, res, next) => {
  try {
    const data = await Bed.aggregate([
      {
        $group: {
          _id: '$bedType',
          available: { $sum: '$availableBeds' },
          total: { $sum: '$totalBeds' }
        }
      }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getFacilityDistribution = async (req, res, next) => {
  try {
    const data = await Facility.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSummary,
  getBloodByGroup,
  getRequestsOverTime,
  getRequestStatusBreakdown,
  getBedAvailability,
  getFacilityDistribution
};
