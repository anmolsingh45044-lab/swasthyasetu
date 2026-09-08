const Bed = require('../models/Bed');

const getBeds = async (req, res, next) => {
  try {
    const { bedType, city, facility } = req.query;
    const filter = {};
    if (bedType) filter.bedType = bedType;
    if (facility) filter.facility = facility;

    let beds = await Bed.find(filter).populate('facility', 'name city state address location');

    if (city) {
      beds = beds.filter(
        (b) => b.facility && b.facility.city && b.facility.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.json({ success: true, count: beds.length, beds });
  } catch (err) {
    next(err);
  }
};

const upsertBed = async (req, res, next) => {
  try {
    const { facility, bedType, totalBeds, availableBeds } = req.body;
    if (!facility || !bedType || totalBeds === undefined || availableBeds === undefined) {
      return res
        .status(400)
        .json({ success: false, message: 'facility, bedType, totalBeds and availableBeds are required.' });
    }

    const bed = await Bed.findOneAndUpdate(
      { facility, bedType },
      { totalBeds, availableBeds },
      { new: true, upsert: true, runValidators: true }
    ).populate('facility', 'name city');

    res.status(201).json({ success: true, bed });
  } catch (err) {
    next(err);
  }
};

const deleteBed = async (req, res, next) => {
  try {
    const bed = await Bed.findByIdAndDelete(req.params.id);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed record not found.' });
    res.json({ success: true, message: 'Bed record removed.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBeds, upsertBed, deleteBed };
