const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  getMyBookings,
  cancelBooking,
  checkAvailablity,
  MonthAvailability,
} = require("../controllers/bookings");

router.route("/owner").get(getAllBookings);
router.route("/renter/").get(getMyBookings);
router.route("/:id").delete(cancelBooking);
router.route("/availability/:id").get(checkAvailablity);
router.route("/month-availability/:id").get(MonthAvailability);

module.exports = router;
