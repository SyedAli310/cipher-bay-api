const express = require('express')

const router = express.Router()

const { auth }  = require('../controllers')

router.post('/login', auth.userLogin)
router.post('/register', auth.userRegister)

module.exports = router