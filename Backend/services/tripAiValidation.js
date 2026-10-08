export const validateSummary = (data) => {
    const fields = ['activities', 'festivals', 'foodRecommendations', 'localEmergency'];
    if (!data || fields.some(field => !Array.isArray(data[field]) || data[field].length === 0)) {
        throw new Error('AI returned incomplete trip details.');
    }
    // Never let a summary response replace the separately generated itinerary.
    return Object.fromEntries(fields.map(field => [field, data[field]]));
};

export const validateItinerary = (data) => {
    if (!Array.isArray(data?.itinerary) || !data.itinerary.length || data.itinerary.some(day =>
        !Number.isInteger(day.day) || !day.title || !day.morning || !day.afternoon || !day.evening)) {
        throw new Error('AI returned an incomplete itinerary.');
    }
    return { itinerary: data.itinerary };
};
