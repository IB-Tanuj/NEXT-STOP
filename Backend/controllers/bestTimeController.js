import supabase from '../config/supabase.js';

export const getBestTimeByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const locKey = location.toLowerCase();

    const { data, error } = await supabase
      .from('best_time_to_visit')
      .select('*')
      .eq('location', locKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return res.status(404).json({ error: "No best time data found for this location" });
      }
      throw error;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching best time:", error.message);
    return res.status(500).json({ error: "Failed to fetch best time data" });
  }
};
