const express = require('express')
const router = express.Router()

const {
    getAllRents,
    getMyRents,
    rateARent
 
} = require('../controllers/rents')

router.route('/owner').get(getAllRents)
router.route('/renter').get(getMyRents)

router.route('/:id').post(rateARent)



module.exports = router
