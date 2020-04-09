const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const router = express.Router();
//var passport = require('passport');
const isAuth = require('../middleware/authentication');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/special', isAuth);
module.exports = router;

