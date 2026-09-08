const Facility = require('../models/Facility');
const Bed = require('../models/Bed');
const OxygenInventory = require('../models/OxygenInventory');
const BloodInventory = require('../models/BloodInventory');
const { distanceKm } = require('../utils/helpers');

const getFacilities = async (req, res, next) => {
  try {
    const { city, type, lat, lng } = req.query;
    const filter = {};
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (type) filter.type = type;

    const facilities = await Facility.find(filter).sort({ name: 1 });

    const enriched = await Promise.all(
      facilities.map(async (f) => {
        const [beds, oxygen, blood] = await Promise.all([
          Bed.find({ facility: f._id }),
          OxygenInventory.find({ facility: f._id }),
          BloodInventory.find({ facility: f._id })
        ]);
        const totalAvailableBeds = beds.reduce((sum, b) => sum + b.availableBeds, 0);
        const totalOxygen = oxygen.reduce((sum, o) => sum + o.availableCylinders, 0);
        const totalBloodUnits = blood.reduce((sum, b) => sum + b.units, 0);
        const distance =
          lat && lng ? distanceKm(parseFloat(lat), parseFloat(lng), f.location.lat, f.location.lng) : null;

        return {
          ...f.toObject(),
          availability: { beds: totalAvailableBeds, oxygen: totalOxygen, blood: totalBloodUnits },
          distanceKm: distance
        };
      })
    );

    if (lat && lng) {
      enriched.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    }

    res.json({ success: true, count: enriched.length, facilities: enriched });
  } catch (err) {
    next(err);
  }
};

const getFacilityById = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found.' });

    const [beds, oxygen, blood] = await Promise.all([
      Bed.find({ facility: facility._id }),
      OxygenInventory.find({ facility: facility._id }),
      BloodInventory.find({ facility: facility._id })
    ]);

    res.json({ success: true, facility, beds, oxygen, blood });
  } catch (err) {
    next(err);
  }
};

const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, facility });
  } catch (err) {
    next(err);
  }
};

const updateFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found.' });
    res.json({ success: true, facility });
  } catch (err) {
    next(err);
  }
};

const deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found.' });
    res.json({ success: true, message: 'Facility removed.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFacilities, getFacilityById, createFacility, updateFacility, deleteFacility };
