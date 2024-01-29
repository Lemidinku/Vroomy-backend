const express = require("express");
const router = express.Router();

const {
  addRequest,
  getRecievedRequests,
  getSentRequests,
  handleRequest,
  cancelRequest,
  addRequestStatic,
  addBooking,
} = require("../controllers/requests");

router.route("/").post(addRequest);
router.route("/test").post(addBooking);
router.route("/static").post(addRequestStatic);

router.route("/owner").get(getRecievedRequests);
router.route("/renter").get(getSentRequests);
router.route("/:id").patch(handleRequest).delete(cancelRequest);
module.exports = router;
