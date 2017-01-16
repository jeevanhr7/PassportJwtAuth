/*jshint esversion: 6 */
const express = require('express'),
    UserController = require('./controllers/userController')


router = express.Router();


router.post('/user', UserController.create);
router.get('/get/:id', UserController.get);

router.get('/list', UserController.list);
router.put('/update/:id', UserController.update);


module.exports = router;