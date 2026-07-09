import axios from 'axios';

export const getTrainStatus = async (req, res) => {
    try {
        const { trainNo } = req.params;

        // This is a generic example for a RapidAPI endpoint.
        // You may need to adjust the URL depending on which specific IRCTC API you subscribe to.
        const options = {
            method: 'GET',
            url: `https://${process.env.RAPIDAPI_HOST}/api/trains-search/v1/train/${trainNo}`,
            params: {
                isH5: 'true',
                client: 'web'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching train status:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to fetch train data.",
            details: error.response?.data || error.message
        });
    }
};
