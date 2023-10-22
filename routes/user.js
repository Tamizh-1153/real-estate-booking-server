const express = require('express')
const router =express.Router()

const {register, login, forgotPassword, resetPassword}=require('../controllers/user')
const  jwtCheck  = require('../config/auth0Config')

router.post('/register',jwtCheck,register)
router.route('/login').post(login)
router.route('/forgot_password').post(forgotPassword)
router.route('/reset_password/:id/:token').post(resetPassword)



module.exports = router