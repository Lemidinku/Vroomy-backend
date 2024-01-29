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
  const { user_id } = req.user;
  const { id: rent_id } = req.params;
  const { rating, account_type } = req.body;

  if (account_type == "renter") {
    // check if the renter has already rated this rent
    const { data: renterSatisfaction, err } = await supabase
      .from("rents")
      .select("renter_satisfaction")
      .eq("rent_id", rent_id)
      .eq("renter_id", user_id)
      .single();

    if (renterSatisfaction.renter_satisfaction != null) {
      res.status(400).json({
        error: "You have already rated this rent",
        ownerRating: renterSatisfaction,
      });
    }

    // update the renter's rating

    const { data, error } = await supabase
      .from("rents")
      .update({ renter_satisfaction: rating })
      .eq("rent_id", rent_id)
      .eq("renter_id", user_id)
      .eq("status", "completed")
      .select("car_id, renter_satisfaction")
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
    }

    // get the owner_id of the car
    const { data: car, error: error2 } = await supabase
      .from("cars")
      .select("owner_id")
      .eq("id", data.car_id)
      .single();

    if (error2) {
      res.status(400).json({ error: error2.message });
    }
    // get the owner's rating, and add this rating to it
    const { data: owner, error: error3 } = await supabase
      .from("profiles")
      .select("rating, rate_amount")
      .eq("id", car.owner_id)
      .single();

    if (error3) {
      res.status(400).json({ error: error3.message });
    }

    const newRating = owner.rating + rating;

    // update the owner's rating
    const { data: updatedOwner, error: error4 } = await supabase
      .from("profiles")
      .update({ rating: newRating, rate_amount: owner.rate_amount + 1 })
      .eq("id", car.owner_id)
      .select("*")
      .single();

    if (error4) {
      res.status(400).json({ error: error4.message });
    }
    res.status(200).json(updatedOwner);
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
      res.status(400).json({
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
      res.status(400).json({ error: error.message });
    }

    // get the renter's rating, and add this rating to it
    const { data: renter, error: error3 } = await supabase
      .from("profiles")
      .select("rating, rate_amount")
      .eq("id", data.renter_id)
      .single();

    if (error3) {
      res.status(400).json({ error: error3.message });
    }

    const newRating = renter.rating + rating;

    // update the renter rating of the car
    const { data: updatedRenter, error: error2 } = await supabase
      .from("profiles")
      .update({ rating: newRating, rate_amount: renter.rate_amount + 1 })
      .eq("id", data.renter_id)
      .select("*")
      .single();

    if (error2) {
      res.status(400).json({ error: error2.message });
    }

    res.status(200).json(updatedRenter);
  }
};

module.exports = {
  getAllRents,
  getMyRents,
  rateARent,
};
