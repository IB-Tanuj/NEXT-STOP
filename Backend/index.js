import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
import userRoutes from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import todayPlanRoutes from "./routes/todayPlanRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";
import { enforcePlanningQuota } from "./middleware/tripQuotaMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/trip", tripRoutes);
app.use("/api/today-plans", todayPlanRoutes);
const planningProtection = [requireAuth, enforcePlanningQuota];
app.use("/api/trains", ...planningProtection, trainRoutes);
app.use("/api/live", ...planningProtection, liveDataRoutes);
app.use("/api/flixbus", ...planningProtection, flixbusRoutes);
app.use("/api/flights", ...planningProtection, flightRoutes);
app.use("/api/vehicle", ...planningProtection, vehicleRoutes);
app.use("/api/images", ...planningProtection, imageRoutes);
app.use("/api/hotels", ...planningProtection, hotelRoutes);
app.use("/api/best-time", ...planningProtection, bestTimeRoutes);
app.use("/api/spots", ...planningProtection, spotInfoRoutes);
app.use("/api/saved-trips", savedTripRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendRoutes);

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
