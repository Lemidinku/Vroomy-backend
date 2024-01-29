const Supabase = require("../db/supabase.js");
const { isCarAvailable } = require("../utils/Availability.js");

const getAllCarsStatic = async (req, res) => {
  const { data, error } = await Supabase.from("cars").select("*, profiles(*)"); // select all columns from cars and profiles table
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  res.status(200).json(data);
};
const getAllCars = async (req, res) => {
  const {
    make,
    type,
    electric,
    seats,
    sort: sort_param,
    search: search_param,
    query,
    start,
    end,
  } = req.query;
  console.log(req.query);
  let result = Supabase.from("cars").select("*, profiles(*)"); // select all columns from cars and profiles table

  // filter by seats
  if (seats) {
    result = result.gt("seating_capacity", parseInt(seats));
  }
  // filter by make
  if (make) {
    result = result.ilike("make_and_model", `%${make}%`);
  }
  // filter by Type
  if (type) {
    result = result.ilike("type", `%${type}%`);
  }
  // filter by Electric
  if (electric) {
    result = result.eq("is_electric", electric);
  }

  //sorting
  if (sort_param === "price") {
    result = result.order("daily_rental_fee", { ascending: true });
  } else if (sort_param === "year") {
    result = result.order("year", { ascending: false });
  }

  // search by car owner
  if (search_param === "owner" && query) {
    result = result.ilike("profiles.username", `%${query}%`);
  }
  // search by type
  else if (query) {
    result = result.ilike("type", `%${query}%`);
  }
  const { data: cars, error } = await result;

  // if availiability filter is on, filter out unavailable cars
  if (start && end) {
    if (cars) {
      cars.filter(async (car) => {
        const { availiablity } = await isCarAvailable(car.id, start, end);
        return availiablity;
      });
    }
  }

  // if the sort is default, sort by owner's rating
  if (!sort_param && cars) {
    cars.sort((a, b) => {
      return b.profiles.rating - a.profiles.rating;
    });
  }
  if (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
  res.status(200).json({ size: cars.length, cars: cars });
};

// get owner's cars
const getMyCars = async (req, res) => {
  const { user_id: owner_id } = req.headers;
  console.log(owner_id);
  const {
    make,
    type,
    electric,
    seats,
    sort: sort_param,
    search: search_param,
    query,
  } = req.query;
  console.log(req.query);
  let result = Supabase.from("cars")
    .select("*, profiles(*)")
    .eq("owner_id", owner_id); // select all columns from cars and profiles table

  // filter by seats
  if (seats) {
    result = result.gt("seating_capacity", parseInt(seats));
  }
  // filter by make
  if (make) {
    result = result.ilike("make_and_model", `%${make}%`);
  }
  // filter by Type
  if (type) {
    result = result.ilike("type", `%${type}%`);
  }
  // filter by Electric
  if (electric) {
    result = result.eq("is_electric", electric);
  }

  //sorting
  if (sort_param === "price") {
    result = result.order("daily_rental_fee", { ascending: true });
  } else if (sort_param === "year") {
    result = result.order("year", { ascending: false });
  }

  // search by car owner
  if (search_param === "owner" && query) {
    result = result.ilike("profiles.username", `%${query}%`);
  }
  // search by type
  else if (query) {
    result = result.ilike("type", `%${query}%`);
  }
  const { data: cars, error } = await result;

  if (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
  res.status(200).json({ size: cars.length, cars: cars });
};

// addCar

const addCar = async (req, res) => {
  const newCar = await Supabase.from("cars").insert([
    {
      //this will be the data from the form
      ...req.body,
    },
  ]);

  res.status(201).json(newCar);
};
// addCarStatic
const addCarStatic = async (req, res) => {
  const newCar = await Supabase.from("cars").insert([
    {
      make_and_model: "Tesla Model S",
      owner_id: "9cc9210d-4530-40f8-a13d-bd2af6d05801",
      year: "2019",
      color: "red",
      seating_capacity: 5,
      daily_rental_fee: 5000,
    },
  ]);

  res.status(201).json(newCar);
};
// getCar,
const getCar = async (req, res) => {
  const { id } = req.params;
  const { data: car, error } = await Supabase.from("cars")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();
  if (error) {
    console.log(error.message);
    return res.status(401).json({ error });
  }
  console.log(car);
  res.status(200).json(car);
};
// updateCar,
const updateCar = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const { data: updatedCar, error } = await Supabase.from("cars")
    .update({
      ...req.body,
    })
    .eq("id", id)
    .eq("owner_id", req.headers.user_id)
    .select("*");
  if (error) {
    console.log(error.message);
    return res.status(401).json({ error });
  }
  res.status(200).json(updatedCar);
};
// deleteCar
const deleteCar = async (req, res) => {
  const { user_id } = req.headers;
  const { id } = req.params;
  const { data: deletedCar, error } = await Supabase.from("cars")
    .delete()
    .eq("id", id)
    .eq("owner_id", user_id);
  if (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
  res.status(200).json(deletedCar);
};
module.exports = {
  getAllCars,
  getAllCarsStatic,
  addCar,
  getCar,
  updateCar,
  deleteCar,
  addCarStatic,
  getMyCars,
};
