const BloodInventory = require('../models/BloodInventory');

const getBloodInventory = async (req, res, next) => {
  try {
    const { bloodGroup, city, facility } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (facility) filter.facility = facility;

    let query = BloodInventory.find(filter).populate('facility', 'name city state address location');
    let inventory = await query;

    if (city) {
      inventory = inventory.filter(
        (i) => i.facility && i.facility.city && i.facility.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.json({ success: true, count: inventory.length, inventory });
  } catch (err) {
    next(err);
  }
};

const upsertBloodInventory = async (req, res, next) => {
  try {
    const { facility, bloodGroup, units } = req.body;
    if (!facility || !bloodGroup || units === undefined) {
      return res.status(400).json({ success: false, message: 'facility, bloodGroup and units are required.' });
    }

    const record = await BloodInventory.findOneAndUpdate(
      { facility, bloodGroup },
      { units },
      { new: true, upsert: true, runValidators: true }
    ).populate('facility', 'name city');

    res.status(201).json({ success: true, inventory: record });
  } catch (err) {
    next(err);
  }
};

const deleteBloodInventory = async (req, res, next) => {
  try {
    const record = await BloodInventory.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Inventory record not found.' });
    res.json({ success: true, message: 'Inventory record removed.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBloodInventory, upsertBloodInventory, deleteBloodInventory };
