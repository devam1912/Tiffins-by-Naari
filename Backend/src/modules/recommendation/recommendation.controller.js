const Provider = require("../tiffin/provider.model");
const { geocode } = require("../../utils/geocoder");


const getNearbyRecommendations = async (req, res) => {
    try {
        let { address, lat, lng, radius = 5 } = req.query;
        radius = parseInt(radius);

        
        const validRadii = [5, 10, 15, 20];
        if (!validRadii.includes(radius)) {
            radius = 5; 
        }

        let coordinates = null;

        if (lat && lng) {
            coordinates = [parseFloat(lng), parseFloat(lat)];
        } else if (address) {
            const geoData = await geocode(address);
            if (geoData) {
                coordinates = [geoData.lng, geoData.lat];
            } else {
                return res.status(400).json({ message: "Could not geocode address" });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Address or Coordinates (lat/lng) required" });
        }

        
        const providers = await Provider.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates,
                    },
                    $maxDistance: radius * 1000, 
                },
            },
            isActive: true,
            isApproved: true,
        }).select("businessName ownerName phone email cuisineType location pricingModel deliverySlots");

        
        const formattedProviders = providers.map((provider) => {
            
            return {
                id: provider._id,
                businessName: provider.businessName,
                ownerName: provider.ownerName,
                phone: provider.phone,
                email: provider.email,
                cuisineType: provider.cuisineType,
                pricingModel: provider.pricingModel,
                deliverySlots: provider.deliverySlots,
                coordinates: {
                    lat: provider.location.coordinates[1],
                    lng: provider.location.coordinates[0],
                },
            };
        });

        res.status(200).json({
            center: {
                lat: coordinates[1],
                lng: coordinates[0],
            },
            radius: radius,
            count: formattedProviders.length,
            providers: formattedProviders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNearbyRecommendations,
};
