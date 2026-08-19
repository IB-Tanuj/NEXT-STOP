import { getDistanceBetweenStations } from "../data/stations";

export const DESTINATION_STATIONS = {
  goa: "MAO",
  manali: "CDG",
};

export const DEFAULT_FOOD_COSTS = {
  local: { min: 100, max: 200, avg: 150 },
  mix: { min: 300, max: 550, avg: 400 },
  restaurant: { min: 600, max: 1200, avg: 850 },
  hotel_meals: { min: 1000, max: 2000, avg: 1400 },
};

export const generateDynamicMediumData = (dist, mode, destinationName) => {
  if (!dist) dist = 1000;

  if (mode === "train") {
    const hours = Math.max(2, Math.round(dist / 55));
    const duration = `${hours}-${Math.round(hours * 1.15)}hr`;
    return {
      options: [
        { type: "General (Unreserved)", min: Math.max(50, Math.round(dist * 0.22 / 10) * 10), max: Math.max(80, Math.round(dist * 0.28 / 10) * 10), duration, note: "No seat reservation, basic seating" },
        { type: "Sleeper Class (SL)", min: Math.max(120, Math.round(dist * 0.40 / 10) * 10), max: Math.max(160, Math.round(dist * 0.50 / 10) * 10), duration, note: "Reaching berths, no AC" },
        { type: "3AC Economy (3E)", min: Math.max(350, Math.round(dist * 1.00 / 50) * 50), max: Math.max(450, Math.round(dist * 1.20 / 50) * 50), duration, note: "3-tier berths, AC, reading lights" },
        { type: "3AC (3A)", min: Math.max(400, Math.round(dist * 1.15 / 50) * 50), max: Math.max(500, Math.round(dist * 1.35 / 50) * 50), duration, note: "3-tier berths, AC, bedding included" },
        { type: "2AC (2A)", min: Math.max(550, Math.round(dist * 1.50 / 50) * 50), max: Math.max(750, Math.round(dist * 1.85 / 50) * 50), duration, note: "2-tier berths, AC, curtains" },
        { type: "1AC (1A)", min: Math.max(900, Math.round(dist * 2.50 / 50) * 50), max: Math.max(1250, Math.round(dist * 3.20 / 50) * 50), duration, note: "Private cabins, premium bedding, meals" }
      ],
      recommended: {
        min: Math.max(120, Math.round(dist * 0.40 / 10) * 10),
        max: Math.max(400, Math.round(dist * 1.15 / 50) * 50)
      }
    };
  }

  if (mode === "bus") {
    const hours = Math.max(1, Math.round(dist / 50));
    const duration = `${hours}-${Math.round(hours * 1.2)}hr`;
    return {
      options: [
        { type: "Non-AC Seater", min: Math.max(80, Math.round(dist * 1.2 / 50) * 50), max: Math.max(120, Math.round(dist * 1.6 / 50) * 50), duration, note: "Direct regular bus" },
        { type: "AC Sleeper", min: Math.max(150, Math.round(dist * 2.0 / 50) * 50), max: Math.max(250, Math.round(dist * 2.6 / 50) * 50), duration, note: "Comfortable overnight bus" },
        { type: "Volvo AC Seater/Sleeper", min: Math.max(200, Math.round(dist * 2.8 / 50) * 50), max: Math.max(350, Math.round(dist * 3.6 / 50) * 50), duration, note: "Premium Volvo / Scania coach" }
      ],
      recommended: {
        min: Math.max(150, Math.round(dist * 2.0 / 50) * 50),
        max: Math.max(350, Math.round(dist * 3.6 / 50) * 50)
      }
    };
  }

  if (mode === "flight") {
    if (dist < 300) {
      return {
        options: [{ type: "Economy Lite (Short Haul)", min: 1800, max: 2500, duration: "1-1.5hr", note: "Propeller / Regional flight" }],
        recommended: { min: 1800, max: 2500 }
      };
    }
    const hours = (dist / 800 + 0.8).toFixed(1);
    const duration = `${hours}hr`;
    return {
      options: [
        { type: "Economy Lite", min: Math.max(2200, Math.round((2000 + dist * 1.2) / 100) * 100), max: Math.max(3000, Math.round((2800 + dist * 1.6) / 100) * 100), duration, note: "Basic seat, no meals, 15kg check-in" },
        { type: "Economy Value/Classic", min: Math.max(2800, Math.round((2600 + dist * 1.5) / 100) * 100), max: Math.max(4000, Math.round((3600 + dist * 2.0) / 100) * 100), duration, note: "Standard seat, snack, 15-20kg check-in" },
        { type: "Economy Flex", min: Math.max(3800, Math.round((3500 + dist * 2.2) / 100) * 100), max: Math.max(6000, Math.round((5500 + dist * 3.0) / 100) * 100), duration, note: "Free changes, standard seat, meal" }
      ],
      recommended: {
        min: Math.max(2200, Math.round((2000 + dist * 1.2) / 100) * 100),
        max: Math.max(4000, Math.round((3600 + dist * 2.0) / 100) * 100)
      }
    };
  }

  if (mode === "personal") {
    return {
      note: `Road trip from starting location to ${destinationName || 'destination'} ~${Math.round(dist)}km`,
      approxFuel: {
        min: Math.max(300, Math.round(dist * 3.5)),
        max: Math.max(600, Math.round(dist * 5.5)),
        note: `Fuel cost based on average mileage and distance`
      }
    };
  }

  return null;
};

export const generateDynamicMultiLegData = (fromStationCode, toStationCode, nearestStationObj, stationToDestDist, destinationName) => {
  if (!fromStationCode || !toStationCode || !nearestStationObj) return null;
  const dist = getDistanceBetweenStations(fromStationCode, toStationCode) || 1000;
  const trainHours = Math.max(2, Math.round(dist / 55));
  const trainDurationStr = `${trainHours}-${Math.round(trainHours * 1.15)}hr`;

  const roadDist = Math.round(stationToDestDist);
  const busHours = Math.max(1, Math.round(roadDist / 35));
  const busDurationStr = `${busHours}-${Math.round(busHours * 1.3)}hr`;
  
  const taxiHours = Math.max(1, Math.round(roadDist / 42));
  const taxiDurationStr = `${taxiHours}-${Math.round(taxiHours * 1.15)}hr`;

  return {
    note: `No direct train to ${destinationName || 'destination'} — trains go to nearest station (${nearestStationObj.name}), then bus/taxi.`,
    stations: {
      [nearestStationObj.code.toLowerCase()]: {
        label: nearestStationObj.name,
        duration: trainDurationStr,
        options: [
          { type: "General", min: Math.max(50, Math.round(dist * 0.22 / 10) * 10), max: Math.max(80, Math.round(dist * 0.28 / 10) * 10) },
          { type: "Sleeper", min: Math.max(120, Math.round(dist * 0.40 / 10) * 10), max: Math.max(160, Math.round(dist * 0.50 / 10) * 10) },
          { type: "3AC", min: Math.max(400, Math.round(dist * 1.15 / 50) * 50), max: Math.max(500, Math.round(dist * 1.35 / 50) * 50) },
          { type: "2AC", min: Math.max(550, Math.round(dist * 1.50 / 50) * 50), max: Math.max(750, Math.round(dist * 1.85 / 50) * 50) },
          { type: "1AC", min: Math.max(900, Math.round(dist * 2.50 / 50) * 50), max: Math.max(1250, Math.round(dist * 3.20 / 50) * 50) }
        ],
        transfer: {
          bus: [
            { type: "Regular Bus", min: Math.max(40, Math.round(roadDist * 1.2 / 10) * 10), max: Math.max(70, Math.round(roadDist * 1.6 / 10) * 10), duration: busDurationStr },
            { type: "AC / Shared Taxi", min: Math.max(100, Math.round(roadDist * 2.2 / 10) * 10), max: Math.max(180, Math.round(roadDist * 3.2 / 10) * 10), duration: busDurationStr }
          ],
          taxi: [
            { type: "Private Taxi", min: Math.max(400, Math.round(roadDist * 12 / 50) * 50), max: Math.max(600, Math.round(roadDist * 18 / 50) * 50), duration: taxiDurationStr }
          ]
        }
      }
    },
    recommended: {
      min: Math.max(120, Math.round(dist * 0.40 / 10) * 10) + Math.max(40, Math.round(roadDist * 1.2 / 10) * 10),
      max: Math.max(400, Math.round(dist * 1.15 / 50) * 50) + Math.max(100, Math.round(roadDist * 2.2 / 10) * 10)
    }
  };
};

export const calculateSmartSplit = (remaining, days, locationKey, groupSize, transport) => {
  let transportPercent = 40;
  const farLocations = ["goa", "kerala"];
  if (farLocations.includes(locationKey)) transportPercent += 5;
  if (days < 3) transportPercent += 5;
  if (days > 7) transportPercent -= 5;
  if (groupSize > 3) transportPercent -= 5;
  if (transport === "personal") transportPercent = 0;
  const foodPercent = 100 - transportPercent;
  return {
    transportBudget: Math.round(remaining * transportPercent / 100),
    foodBudget: Math.round(remaining * foodPercent / 100),
    transportPercent,
    foodPercent,
  };
};
