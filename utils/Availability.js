const Supabase = require("../db/supabase.js")

const isCarAvailable = async (car_id, START_DATE, END_DATE) => {

    const { data: bookings, error } =  await Supabase
        .from('bookings')
        .select('*')
        .eq('car_id', car_id)
        .lte('start_date', END_DATE)
        .gte('end_date', START_DATE)
    

    //check if the car is active
    const { data: cars, error: error2 } = await Supabase
        .from('cars')
        .select('*')
        .eq('id', car_id)
        .eq("is_active", true).single()

    // check if the car is currently on a rent
    const { data: rented, error: error3 } = await Supabase
        .from('rents')
        .select('*')
        .eq('car_id', car_id)
        .eq("status", "ongoing")

    if (error) return {"error": error}
    if (bookings.length > 0 || cars || rented) return {"availiablity": false, "error": null}
    return {"availiablity": false, "error": null}
}

module.exports = { isCarAvailable }