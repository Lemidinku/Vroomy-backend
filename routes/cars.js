const express = require('express')
const router = express.Router()

const {
  getAllCars,
  getAllCarsStatic,
} = require('../controllers/cars')

router.route('/').get(getAllCars)
router.route('/static').get(getAllCarsStatic)

module.exports = router
