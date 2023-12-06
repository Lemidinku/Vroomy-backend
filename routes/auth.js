const express = require('express')
const router = express.Router()

const {
  userLogin,
  userLoginStatic,
  userLogout,
  userSignup

} = require('../controllers/auth.js')

// router.route('/static').get(userLoginStatic)

router.route('/login').post(userLogin)
router.route('/signup').post(userSignup)
router.route('/logout').get(userLogout)


module.exports = router
