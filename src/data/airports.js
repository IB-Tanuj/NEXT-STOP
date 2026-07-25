import { haversineDistance } from './stations.js';

// ✈️ Major Indian Airports for Origin Selection
export const airports = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", state: "Delhi", lat: 28.5562, lng: 77.1000 },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", state: "Maharashtra", lat: 19.0896, lng: 72.8656 },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", state: "Karnataka", lat: 13.1989, lng: 77.7068 },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", state: "Tamil Nadu", lat: 12.9941, lng: 80.1709 },
  { code: "CCU", name: "Netaji Subhash Chandra Bose International Airport", city: "Kolkata", state: "West Bengal", lat: 22.6540, lng: 88.4467 },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", state: "Telangana", lat: 17.2403, lng: 78.4294 },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", state: "Gujarat", lat: 23.0734, lng: 72.6347 },
  { code: "PNQ", name: "Pune Airport", city: "Pune", state: "Maharashtra", lat: 18.5793, lng: 73.9089 },
  { code: "GOI", name: "Goa International Airport (Dabolim)", city: "Goa", state: "Goa", lat: 15.3808, lng: 73.8313 },
  { code: "GOX", name: "Manohar International Airport (Mopa)", city: "Goa", state: "Goa", lat: 15.7314, lng: 73.8658 },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", state: "Kerala", lat: 10.1518, lng: 76.3930 },
  { code: "TRV", name: "Trivandrum International Airport", city: "Thiruvananthapuram", state: "Kerala", lat: 8.4821, lng: 76.9200 },
  { code: "CCJ", name: "Calicut International Airport", city: "Kozhikode", state: "Kerala", lat: 11.1368, lng: 75.9553 },
  { code: "CNN", name: "Kannur International Airport", city: "Kannur", state: "Kerala", lat: 11.9175, lng: 75.5472 },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", state: "Rajasthan", lat: 26.8242, lng: 75.8122 },
  { code: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow", state: "Uttar Pradesh", lat: 26.7606, lng: 80.8893 },
  { code: "VNS", name: "Lal Bahadur Shastri International Airport", city: "Varanasi", state: "Uttar Pradesh", lat: 25.4520, lng: 82.8592 },
  { code: "PAT", name: "Jay Prakash Narayan Airport", city: "Patna", state: "Bihar", lat: 25.5913, lng: 85.0880 },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", state: "Assam", lat: 26.1061, lng: 91.5859 },
  { code: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar", state: "Odisha", lat: 20.2444, lng: 85.8178 },
  { code: "IXC", name: "Shaheed Bhagat Singh International Airport", city: "Chandigarh", state: "Chandigarh", lat: 30.6735, lng: 76.7885 },
  { code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", city: "Amritsar", state: "Punjab", lat: 31.7096, lng: 74.7973 },
  { code: "SXR", name: "Sheikh ul-Alam International Airport", city: "Srinagar", state: "Jammu and Kashmir", lat: 33.9980, lng: 74.7745 },
  { code: "IXJ", name: "Jammu Airport", city: "Jammu", state: "Jammu and Kashmir", lat: 32.6888, lng: 74.8378 },
  { code: "IXL", name: "Kushok Bakula Rimpochee Airport", city: "Leh", state: "Ladakh", lat: 34.1359, lng: 77.5465 },
  { code: "VTZ", name: "Visakhapatnam International Airport", city: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.7211, lng: 83.2244 },
  { code: "TIR", name: "Tirupati Airport", city: "Tirupati", state: "Andhra Pradesh", lat: 13.6325, lng: 79.5432 },
  { code: "VGA", name: "Vijayawada International Airport", city: "Vijayawada", state: "Andhra Pradesh", lat: 16.5304, lng: 80.7968 },
  { code: "NAG", name: "Dr. Babasaheb Ambedkar International Airport", city: "Nagpur", state: "Maharashtra", lat: 21.0922, lng: 79.0472 },
  { code: "IDR", name: "Devi Ahilya Bai Holkar Airport", city: "Indore", state: "Madhya Pradesh", lat: 22.7218, lng: 75.8011 },
  { code: "BHO", name: "Raja Bhoj Airport", city: "Bhopal", state: "Madhya Pradesh", lat: 23.2872, lng: 77.3375 },
  { code: "IXB", name: "Bagdogra Airport", city: "Siliguri", state: "West Bengal", lat: 26.6812, lng: 88.3286 },
  { code: "CJB", name: "Coimbatore International Airport", city: "Coimbatore", state: "Tamil Nadu", lat: 11.0300, lng: 77.0434 },
  { code: "TRZ", name: "Tiruchirappalli International Airport", city: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.7654, lng: 78.7176 },
  { code: "IXM", name: "Madurai Airport", city: "Madurai", state: "Tamil Nadu", lat: 9.8345, lng: 78.0934 }
];

// ✈️ HELPER: Get airports by city name
export const getAirportsByCity = (cityName) => {
  if (!cityName) return [];
  const cName = cityName.toLowerCase().replace("new ", "");
  return airports.filter(a => a.city.toLowerCase().includes(cName));
};

// 📍 HELPER: Get nearby airports by GPS coordinates
export const getNearbyAirports = (lat, lng, limit = 2) => {
  if (!lat || !lng) return [];
  return airports
    .map(airport => ({
      ...airport,
      distance: haversineDistance(lat, lng, airport.lat, airport.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};
