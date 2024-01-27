const express =require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/otp', authController.otp);

router.post('/logout',authController.logout)

router.post('/cancel',authController.cancel)

module.exports=router;