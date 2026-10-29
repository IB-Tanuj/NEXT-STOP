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

app.disable("x-powered-by");

const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const isProduction = process.env.NODE_ENV === "production";

app.use(cors({
  origin(origin, callback) {
    if (!origin || !isProduction || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (isProduction) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

app.use(express.json({ limit: "1mb" }));

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

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error?.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ error: "Origin is not allowed" });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body is too large" });
  }

  console.error("Unhandled API error:", error);
  return res.status(error?.statusCode || 500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
