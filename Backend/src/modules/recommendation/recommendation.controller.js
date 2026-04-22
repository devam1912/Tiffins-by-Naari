const Provider = require("../tiffin/provider.model");
const { geocode } = require("../../utils/geocoder");
const axios = require("axios");


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

/**
 * Fetch personalized food recommendations from Python service
 */
const getUserRecommendations = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Python service runs on localhost:8000 inside the container
        const PYTHON_URL = process.env.RECOMMENDATION_SERVICE_URL || "http://127.0.0.1:8000";
        const response = await axios.get(`${PYTHON_URL}/recommendations/${userId}`, {
            timeout: 8000, // Don't hang forever if Python is still loading
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.warn("Recommendation Service unavailable (non-fatal):", error.message);
        // Return empty recommendations gracefully — never a 500
        res.status(200).json({ top_picks: [], similar_items: [] });
    }
};

module.exports = {
    getNearbyRecommendations,
    getUserRecommendations,
};
