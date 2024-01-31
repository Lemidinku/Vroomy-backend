const { error } = require("console");
const supabase = require("../db/supabase.js");

// getAllRents, owner get all the rents they have made (ongoing and completed)

const getAllRents = async (req, res) => {
  const { user_id: owner_id } = req.headers;
  const { status } = req.query;

  const rents = supabase.from("rents").select("cars(*), *");

  if (status && status.lower() == "ongoing") {
    rents.eq("status", "ongoing");
  }
  if (status && status.lower() == "completed") {
    rents.eq("status", "completed");
  }

  const { data, error } = await rents;
  let filteredRents = data.filter((rent) => {
    return rent.cars.owner_id === owner_id;
  });

  if (error) {
    res.status(400).json({ error: error.message });
  }
  console.log(filteredRents);
  res.status(200).json(filteredRents);
};

// getMyRents, renter get all the rents they have made (ongoing and completed)

const getMyRents = async (req, res) => {
  const { user_id: renter_id } = req.headers;
  const { status } = req.query;

  const rents = supabase
    .from("rents")
    .select("* cars(*)")
    .eq("renter_id", renter_id);

  if (status.lower() == "ongoing") {
    rents.eq("status", "ongoing");
  }
  if (status.lower() == "completed") {
    rents.eq("status", "completed");
  }

  if (error) {
    res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
};
// rateARent

const rateARent = async (req, res) => {
  const { user_id } = req.headers;
  const { id: rent_id } = req.params;
  const { rating, account_type } = req.body;

  if (account_type == "renter") {
    // check if the renter has already rated this rent
    const { data: renterSatisfaction, err } = await supabase
      .from("rents")
      .select("*")
      .eq("rent_id", rent_id)
      .single();
    console.log("afdsf", renterSatisfaction);
    if (renterSatisfaction.renter_satisfaction != null) {
      res.status(400).json({
        error: "You have already rated this rent",
        ownerRating: renterSatisfaction,
      });
      return;
    }

    // update the rent's rating

    const { data, error } = await supabase
      .from("rents")
      .update({ renter_satisfaction: rating })
      .eq("rent_id", rent_id)
      .eq("status", "completed")
      .select("car_id, renter_satisfaction")
      .single();

    if (error) {
      return res.status(401).json({ error: error.message });
    }
    // console.log(data);
    res.status(200).json(data);
  } else {
    // check if the owner has already rated this rent
    const { data: ownerSatisfaction, err } = await supabase
      .from("rents")
      .select("owner_satisfaction")
      .eq("rent_id", rent_id)
      .single();

    if (err) {
      res.status(400).json({ error: err.message });
    }
    if (ownerSatisfaction.owner_satisfaction) {
      return res.status(400).json({
        error: "You have already rated this rent",
        renterRating: ownerSatisfaction,
      });
    }

    // update the rent's rating
    const { data, error } = await supabase
      .from("rents")
      .update({ owner_satisfaction: rating })
      .eq("rent_id", rent_id)
      .eq("status", "completed")
      .select("car_id, owner_satisfaction, renter_id")
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    } else return res.status(200).json({ error: null });
  }
};

module.exports = {
  getAllRents,
  getMyRents,
  rateARent,
};
