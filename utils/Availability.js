const Supabase = require("../db/supabase.js");

const isCarAvailable = async (car_id, START_DATE, END_DATE) => {
  const { data: bookings, error } = await Supabase.from("bookings")
    .select("*")
    .eq("car_id", car_id)
    .lte("start_date", END_DATE)
    .gte("return_date", START_DATE);

  //check if the car is active
  const { data: car, error: error2 } = await Supabase.from("cars")
    .select("*")
    .eq("id", car_id)
    .single();

  // check if the car is currently on a rent
  const { data: ongoingRent, error: error3 } = await Supabase.from("rents")
    .select("*")
    .eq("car_id", car_id)
    .eq("status", "ongoing")
    .single();
  console.log(bookings);
  if (error) return { error: error };
  if (bookings.length > 0 || !car.is_active || ongoingRent)
    return { availability: false };
  return { availability: true };
};

const MonthlyAvailability = async (car_id, start_date, end_date) => {
  const { data: bookings, error } = await Supabase.from("bookings")
    .select("*")
    .eq("car_id", car_id)
    .lte("start_date", end_date)
    .gte("return_date", start_date);

  if (error) return { error: error };

  let booked_dates = [];
  for (let i = 0; i < bookings.length; i++) {
    start = bookings[i].start_date;
    end = bookings[i].return_date;
    while (start <= end) {
      if (start > end_date) break;
      if (start >= start_date);
      booked_dates.push(start);
      start = new Date(start);
      start.setDate(start.getDate() + 1);
      start = start.toISOString().split("T")[0];
      //   start.setDate(start.getDate() + 1);
    }
  }
  return { bookedDates: booked_dates, error: null };
};

module.exports = { isCarAvailable, MonthlyAvailability };
