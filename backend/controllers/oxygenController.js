const OxygenInventory = require('../models/OxygenInventory');

const getOxygen = async (req, res, next) => {
  try {
    const { city, facility } = req.query;
    const filter = {};
    if (facility) filter.facility = facility;

    let oxygen = await OxygenInventory.find(filter).populate('facility', 'name city state address location');

    if (city) {
      oxygen = oxygen.filter(
        (o) => o.facility && o.facility.city && o.facility.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.json({ success: true, count: oxygen.length, oxygen });
  } catch (err) {
    next(err);
  }
};

const upsertOxygen = async (req, res, next) => {
  try {
    const { facility, cylinderType, availableCylinders, capacity, id } = req.body;
    if (!facility || availableCylinders === undefined) {
      return res.status(400).json({ success: false, message: 'facility and availableCylinders are required.' });
    }

    let record;
    if (id) {
      record = await OxygenInventory.findByIdAndUpdate(
        id,
        { cylinderType, availableCylinders, capacity },
        { new: true, runValidators: true }
      );
    } else {
      record = await OxygenInventory.create({ facility, cylinderType, availableCylinders, capacity });
    }

    res.status(201).json({ success: true, oxygen: record });
  } catch (err) {
    next(err);
  }
};

const deleteOxygen = async (req, res, next) => {
  try {
    const record = await OxygenInventory.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Oxygen record not found.' });
    res.json({ success: true, message: 'Oxygen record removed.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOxygen, upsertOxygen, deleteOxygen };
