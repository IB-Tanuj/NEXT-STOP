import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import supabase from "../config/supabase.js";

const customCities = [
  { name: "Meerut", id: "e0302579-3eac-4c4a-a095-512e13ca6766" },
  { name: "Panipat", id: "68743e57-6cfd-464f-b20f-916149ed5e07" },
  { name: "Muzaffarnagar", id: "703142eb-07dc-4b79-8f14-46914d574a47" },
  { name: "Roorkee", id: "0ecfda56-b052-4dd9-9570-3611f6829d05" },
  { name: "Haridwar", id: "5eeebba8-48cf-4ae7-8cc2-7c9810d708ab" },
  { name: "Tapovan (Uttarakhand)", id: "88416b24-d9e6-435e-93ec-45f44a7e52ef" },
  { name: "Mussoorie", id: "69ef7507-6c7b-46c4-aec9-aa68272b2cc7" },
  { name: "Indore", id: "e0f1c563-105d-4d03-89b4-616b1ca402f9" },
  { name: "Ujjain", id: "7c96c1cd-b3ee-47fa-9779-ca104a3002c3" },
  { name: "Udaipur", id: "939842b1-ec33-4a6a-b470-84eb400fc209" },
  { name: "Varanasi", id: "519aa8d6-a563-4df0-9121-23d8638a79cc" },
  { name: "Prayagraj", id: "de00b922-bf1d-4bb0-bd01-f3969e61d2df" },
  { name: "Kanpur", id: "8f3aa150-cbaa-44aa-8692-aa56cc1f2b47" },
  { name: "Gorakhpur", id: "96d7b3c3-3868-4b5e-b966-795a9ec360eb" },
  { name: "Ayodhya", id: "2dd8377b-891c-466b-882f-ccfbcaec4966" },
  { name: "Lucknow", id: "32eee6a1-df44-4246-859a-fdcc12261c6e" },
  { name: "Agra", id: "07058d4f-cf02-498c-a38d-106ea11bb502" },
  { name: "Bareilly", id: "2c6af139-709b-40fe-9a26-e2d31c8c2450" },
  { name: "Greater Noida", id: "4f508ee5-e6cf-46ee-99cc-11ce0541ac11" },
  { name: "Haldwani", id: "0ed16ca1-86ff-4c56-bf38-58b6ee723e07" },
  { name: "Bhimtal", id: "3295af5a-7243-4a61-9b3a-0949914c9af6" },
  { name: "Nainital", id: "2e76844a-10f7-45f9-bd5f-54f07af06b83" },
  { name: "Kainchi Dham", id: "2af6c571-5263-4013-a970-8b61cf7587c4" },
  { name: "Ludhiana, Punjab", id: "f651808c-8d9f-4618-8e00-9480a554aaee" },
  { name: "Shimla", id: "78d91747-ac07-4ae7-a19e-c1ae8f5b21e4" }
];

async function seedUserCities() {
  console.log(`Inserting ${customCities.length} custom cities into Supabase flixbus_cities table...`);
  try {
    const formattedCities = customCities.map(city => ({
      rapidapi_id: city.id,
      name: city.name,
      country: "India", // Assuming they are all in India
      is_supported: true
    }));

    // Upsert to handle duplicates safely
    const { error } = await supabase
      .from('flixbus_cities')
      .upsert(formattedCities, { onConflict: 'rapidapi_id' });

    if (error) {
      console.error("Error inserting cities:", error);
    } else {
      console.log("Successfully seeded custom cities!");
    }

  } catch (error) {
    console.error("Script failed:", error.message);
  }
}

seedUserCities().then(() => {
    process.exit(0);
});
