const Supabase = require("../db/supabase.js");
const {
  isCarAvailable,
  MonthlyAvailability,
} = require("../utils/Availability.js");

// getAllBookings,
const getAllBookings = async (req, res) => {
  const { user_id: owner_id } = req.headers;
  const { data, error } = await Supabase.from("bookings").select("cars(*), *");
  if (error) {
    res.status(400).json({ error: error.message });
  }

  // I think this can be done in the query above, but I'm not sure how to do it.
  let filteredBooking = data.filter((booking) => {
    return booking.cars.owner_id === owner_id;
  });
  res.status(200).json(filteredBooking);
};

// getMyBookings,
const getMyBookings = async (req, res) => {
  const { user_id: renter_id } = req.headers;
  const { data, error } = await Supabase.from("bookings")
    .select("*")
    .eq("renter_id", renter_id);
  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json(data);
  }
};

// cancelBooking
const cancelBooking = async (req, res) => {
  const booking_id = req.params.id;
  const { data: deletedBooking, error } = await Supabase.from("bookings")
    .delete()
    .eq("id", booking_id)
    .select("*");
  if (error) {
    console.log(error.message);
    return res.status(401).json({ error });
  }
  res.status(200).json(deletedBooking);
};

// checkAvailablity
const checkAvailablity = async (req, res) => {
  const { id: CarId } = req.params;
  const { start, end } = req.query;
  //   console.log(req.query);

  let { availability, error } = await isCarAvailable(CarId, start, end);
  console.log("availability", availability);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ availability: availability, error: null });
};

const MonthAvailability = async (req, res) => {
  const { id: CarId } = req.params;
  const { startDate, endDate } = req.query;
  const { bookedDates, error } = await MonthlyAvailability(
    CarId,
    startDate,
    endDate
  );

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ bookedDates: bookedDates, error: null });
};

module.exports = {
  getAllBookings,
  getMyBookings,
  cancelBooking,
  checkAvailablity,
  MonthAvailability,
};
