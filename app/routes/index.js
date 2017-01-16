/*jshint esversion: 6 */

const  express =  require('express');
const AuthController = require('./controllers/authController');
const passport = require('passport');




const router = express.Router();

router.get('/', (req, res) =>
    res.send('OK')
);

module.exports=router;