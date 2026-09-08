const Donation = require('../models/Donation');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

const createDonation = async (req, res, next) => {
  try {
    const { facility, bloodGroup, units, donationDate, bloodRequest } = req.body;
    if (!bloodGroup) {
      return res.status(400).json({ success: false, message: 'bloodGroup is required.' });
    }

    const donation = await Donation.create({
      donor: req.user._id,
      facility,
      bloodGroup,
      units: units || 1,
      donationDate,
      bloodRequest: bloodRequest || null
    });

    await createNotification({
      user: req.user._id,
      title: 'Donation scheduled',
      message: `Your donation of ${bloodGroup} blood has been scheduled. Thank you for donating!`,
      type: 'success'
    });

    res.status(201).json({ success: true, donation });
  } catch (err) {
    next(err);
  }
};

const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('facility', 'name city')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, donations });
  } catch (err) {
    next(err);
  }
};

const updateDonationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Scheduled', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });

    donation.status = status;
    await donation.save();

    if (status === 'Completed') {
      await User.findByIdAndUpdate(donation.donor, {
        $inc: { 'donorProfile.totalDonations': 1 },
        $set: { 'donorProfile.lastDonationDate': new Date() }
      });
    }

    res.json({ success: true, donation });
  } catch (err) {
    next(err);
  }
};

module.exports = { createDonation, getMyDonations, updateDonationStatus };
