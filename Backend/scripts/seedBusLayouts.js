import supabase from "../config/supabase.js";

async function seedLayouts() {
  console.log("Seeding Bus Layouts...");

  // 1. Create Sleeper 2+1 Layout (30 capacity)
  const sleeperLayout = {
    name: "A/C Sleeper (2+1)",
    total_capacity: 30,
  };

  const { data: sleeperData, error: sleeperError } = await supabase
    .from("bus_layouts")
    .insert([sleeperLayout])
    .select()
    .single();

  if (sleeperError) {
    console.error("Error creating sleeper layout:", sleeperError);
    return;
  }

  console.log(`Created Layout: ${sleeperData.name}`);

  // 2. Create Semi-Sleeper 2+2 Layout (40 capacity)
  const semiLayout = {
    name: "A/C Semi-Sleeper (2+2)",
    total_capacity: 40,
  };

  const { data: semiData, error: semiError } = await supabase
    .from("bus_layouts")
    .insert([semiLayout])
    .select()
    .single();

  if (semiError) {
    console.error("Error creating semi-sleeper layout:", semiError);
    return;
  }

  console.log(`Created Layout: ${semiData.name}`);

  // 3. Generate Seats for Sleeper (10 rows, 3 seats per row)
  const sleeperSeats = [];
  for (let row = 1; row <= 10; row++) {
    // Left side (Single Bed)
    sleeperSeats.push({
      layout_id: sleeperData.id,
      seat_number: `L${row}`,
      category: "Single-Bed",
      row_index: row,
      col_index: 0,
    });
    // Right side (Double Bed)
    sleeperSeats.push({
      layout_id: sleeperData.id,
      seat_number: `R${row}A`,
      category: "Double-Bed",
      row_index: row,
      col_index: 2,
    });
    sleeperSeats.push({
      layout_id: sleeperData.id,
      seat_number: `R${row}B`,
      category: "Double-Bed",
      row_index: row,
      col_index: 3,
    });
  }

  // 4. Generate Seats for Semi-Sleeper (10 rows, 4 seats per row)
  const semiSeats = [];
  for (let row = 1; row <= 10; row++) {
    const isPanorama = row === 1;
    const category = isPanorama ? "Panorama" : "Classic";
    
    semiSeats.push({ layout_id: semiData.id, seat_number: `${row}A`, category, row_index: row, col_index: 0 });
    semiSeats.push({ layout_id: semiData.id, seat_number: `${row}B`, category, row_index: row, col_index: 1 });
    // Aisle is col 2
    semiSeats.push({ layout_id: semiData.id, seat_number: `${row}C`, category, row_index: row, col_index: 3 });
    semiSeats.push({ layout_id: semiData.id, seat_number: `${row}D`, category, row_index: row, col_index: 4 });
  }

  // Insert all seats
  const { error: seatError1 } = await supabase.from("seat_templates").insert(sleeperSeats);
  const { error: seatError2 } = await supabase.from("seat_templates").insert(semiSeats);

  if (seatError1 || seatError2) {
    console.error("Error inserting seats:", seatError1 || seatError2);
  } else {
    console.log("Successfully seeded 30 Sleeper seats and 40 Semi-Sleeper seats!");
  }
}

seedLayouts();
