import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./config/supabase.js";
import trainRoutes from "./routes/trainRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import liveDataRoutes from "./routes/liveDataRoutes.js";
import flixbusRoutes from "./routes/flixbusRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import bestTimeRoutes from "./routes/bestTimeRoutes.js";
import spotInfoRoutes from "./routes/spotInfoRoutes.js";
import savedTripRoutes from "./routes/savedTripRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/trains", trainRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/live", liveDataRoutes);
app.use("/api/flixbus", flixbusRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/best-time", bestTimeRoutes);
app.use("/api/spots", spotInfoRoutes);
app.use("/api/saved-trips", savedTripRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Next Stop Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;