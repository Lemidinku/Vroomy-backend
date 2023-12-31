const express = require('express')
const router = express.Router()

const {
  getAllBookings,
  getMyBookings,
  cancelBooking,
  checkAvailablity
} = require('../controllers/bookings')

router.route('/owner').get(getAllBookings)
router.route("/renter/").get(getMyBookings)
router.route('/:id').delete(cancelBooking)
router.route('/availablity/:id').get(checkAvailablity)


module.exports = router
