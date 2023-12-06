const Supabase = require('../db/supabase.js');

const getAllCarsStatic = async (req, res) => {
  const Cars = await Supabase.from("cars").select()

  res.status(200).json(Cars);
};
const getAllCars = async (req, res) => {
  res.status(200).json("<h1>All car lists</h1>")
  // res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllCars,
  getAllCarsStatic,
};
