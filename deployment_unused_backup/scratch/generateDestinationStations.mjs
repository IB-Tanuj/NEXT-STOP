import { locationData } from '../src/data/locationData.js';
import { stations, findNearestStation } from '../src/data/stations.js';
import fs from 'fs';
import path from 'path';

// Existing 4 overrides
const overrides = {
  goa: { code: "MAO", name: "Madgaon Junction" },
  manali: { code: "CDG", name: "Chandigarh" },
  kerala: { code: "ERS", name: "Ernakulam Junction" },
  rajasthan: { code: "JP", name: "Jaipur Junction" },
};

const destinationStations = {};

for (const key of Object.keys(locationData)) {
  if (overrides[key]) {
    destinationStations[key] = overrides[key];
    continue;
  }
  const loc = locationData[key];
  if (loc && loc.coords && loc.coords.length === 2) {
    const nearest = findNearestStation(loc.coords[0], loc.coords[1]);
    if (nearest) {
      destinationStations[key] = {
        code: nearest.code,
        name: nearest.name
      };
    }
  }
}

// Format as ESM content
const content = `// Auto-generated mapping of destination locations to nearest railway station codes
export const destinationStations = ${JSON.stringify(destinationStations, null, 2)};
`;

fs.writeFileSync('../Backend/utils/destinationStations.js', content, 'utf8');
console.log("Successfully generated Backend/utils/destinationStations.js!");
