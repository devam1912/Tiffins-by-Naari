const Tiffin = require("./tiffin.model");

const getNearbyTiffins = async (req, res) => {
  try {
    const { lat, lng, distance = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const tiffins = await Tiffin.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: distance * 1000, // km → meters
        },
      },
      isActive: true,
    });

    res.status(200).json(tiffins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNearbyTiffins };
