/**
 * Vehicle Cost Calculator Controller
 * Computes fuel, toll, and total trip expenses for personal vehicles (Cars & Bikes).
 */

const VEHICLE_PRESETS = {
  bike: {
    name: "Motorcycle / Scooter",
    mileage: { petrol: 45, diesel: 40, ev: 60 },
    defaultFuelType: "petrol",
    tollPerKm: 0 // Bikes are exempt on Indian national highways
  },
  hatchback: {
    name: "Hatchback Car (Swift / i20)",
    mileage: { petrol: 18, diesel: 22, ev: 8.5 },
    defaultFuelType: "petrol",
    tollPerKm: 1.65
  },
  sedan: {
    name: "Sedan Car (City / Verna)",
    mileage: { petrol: 15, diesel: 18, ev: 7.5 },
    defaultFuelType: "petrol",
    tollPerKm: 1.85
  },
  suv: {
    name: "SUV / MUV (Thar / Creta / Innova)",
    mileage: { petrol: 11, diesel: 14, ev: 6.0 },
    defaultFuelType: "diesel",
    tollPerKm: 2.10
  }
};

const DEFAULT_FUEL_PRICES = {
  petrol: 100, // ₹ / liter
  diesel: 90,  // ₹ / liter
  ev: 10       // ₹ / kWh
};

export const calculateVehicleCost = async (req, res) => {
  try {
    const params = { ...req.query, ...req.body };

    const distanceKm = parseFloat(params.distanceKm) || 0;
    if (distanceKm <= 0) {
      return res.status(400).json({
        error: "Invalid or missing distanceKm. Please provide a positive distance in kilometers."
      });
    }

    const vehicleType = (params.vehicleType || "hatchback").toLowerCase();
    const preset = VEHICLE_PRESETS[vehicleType] || VEHICLE_PRESETS.hatchback;

    const fuelType = (params.fuelType || preset.defaultFuelType).toLowerCase();
    const fuelPrice = parseFloat(params.fuelPrice) || DEFAULT_FUEL_PRICES[fuelType] || 100;
    const passengerCount = Math.max(1, parseInt(params.passengerCount) || 1);

    // Mileage in km/L or km/kWh
    const mileage = preset.mileage[fuelType] || preset.mileage.petrol;

    // Fuel calculation
    const fuelRequired = Math.round((distanceKm / mileage) * 100) / 100; // liters or kWh
    const fuelCost = Math.round(fuelRequired * fuelPrice);

    // Toll calculation (Bikes ₹0, Cars ~₹1.65-₹2.10/km unless override provided)
    let tollCost = 0;
    if (params.tollOverride !== undefined && params.tollOverride !== null && params.tollOverride !== "") {
      tollCost = Math.max(0, parseInt(params.tollOverride));
    } else {
      tollCost = Math.round(distanceKm * preset.tollPerKm);
    }

    const totalCost = fuelCost + tollCost;
    const costPerPerson = Math.round(totalCost / passengerCount);

    const result = {
      vehicleType,
      vehicleName: preset.name,
      fuelType,
      distanceKm,
      passengerCount,
      specifications: {
        mileage: `${mileage} ${fuelType === 'ev' ? 'km/kWh' : 'km/L'}`,
        fuelPriceRate: `₹${fuelPrice}/${fuelType === 'ev' ? 'kWh' : 'L'}`
      },
      breakdown: {
        fuelRequired: `${fuelRequired} ${fuelType === 'ev' ? 'kWh' : 'L'}`,
        fuelCost,
        tollCost,
        totalTripCost: totalCost,
        costPerPerson
      },
      tips: [
        "Use FASTag on National Highways to avoid double toll penalties.",
        fuelType === 'ev' ? "Plan charging stops every 200-250 km." : "Keep tire pressure optimal to save up to 10% on fuel."
      ],
      calculatedAt: new Date().toISOString()
    };

    res.json(result);

  } catch (error) {
    console.error("Error calculating vehicle cost:", error.message);
    res.status(500).json({
      error: "Failed to calculate vehicle cost.",
      details: error.message
    });
  }
};
