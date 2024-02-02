const express = require("express");
const router = express.Router();

const {
  getAllRents,
  getMyRents,
  rateARent,
  getRent,
} = require("../controllers/rents");

router.route("/owner").get(getAllRents);
router.route("/renter").get(getMyRents);

router.route("/:id").post(rateARent).get(getRent);

module.exports = router;
