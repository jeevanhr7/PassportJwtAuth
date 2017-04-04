/*jshint esversion: 6 */
const express = require('express');
const passport = require('passport');
const AuthenticationController = require('./controllers/auth.controller');
const passportService = require('../config/passport');
const UserController = require('./controllers/user.controller');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });


router = express.Router();


router.post('/register', AuthenticationController.register);
router.post('/login', requireAuth, AuthenticationController.login);


router.post('/add', requireAuth, UserController.add);



module.exports = router;