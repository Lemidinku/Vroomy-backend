const express = require('express')
const router = express.Router()

const {
  getAllCars,
  getAllCarsStatic,
  addCar,
  getCar,
  updateCar,
  deleteCar,
  addCarStatic,
} = require('../controllers/cars')

router.route('/').get(getAllCars).post(addCar)
router.route('/:id').get(getCar).patch(updateCar).delete(deleteCar)
router.route('/static').get(getAllCarsStatic).post(addCarStatic)

module.exports = router
