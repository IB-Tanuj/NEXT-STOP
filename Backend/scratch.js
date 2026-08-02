import supabase from './config/supabase.js';

async function testQuery(from, to) {
    const { data: cities, error } = await supabase
        .from('flixbus_cities')
        .select('rapidapi_id, name')
        .or(`name.ilike.${from},name.ilike.${to}`);

    console.log("Supabase error:", error);
    console.log("Supabase returned:", cities);
    
    const fromCity = cities?.find(c => c.name.toLowerCase() === from.toLowerCase());
    const toCity = cities?.find(c => c.name.toLowerCase() === to.toLowerCase());
    
    console.log("Matched from:", fromCity);
    console.log("Matched to:", toCity);
}

testQuery('Delhi', 'Manali');
