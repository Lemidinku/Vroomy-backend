const express = require('express')
const router = express.Router()

const {
    getMyNotifications,
    readNotification,
    deleteNotification
} = require('../controllers/notifications')

router.route('/').get(getMyNotifications)
router.route('/:id').patch(readNotification)
router.route('/:id').delete(deleteNotification)




module.exports = router
