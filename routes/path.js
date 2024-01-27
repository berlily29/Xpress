const express = require('express');

const router = express.Router();
const forgotController = require('../controllers/forgot')

router.get('/',(req,res)=> {
    res.render("home");
})

router.get('/login',(req,res)=> {
    res.render("login");
})

router.get('/register',(req,res)=> {
    res.render("register");
})


router.get('/forgotpassword',(req,res) => {
    res.render('forgot')
})


router.get('/auth/forgotpassword',(req,res) => {
    res.render('forgot')
})

router.get('/dashboard', (req,res)=> {
    res.render('dashboard')
})


router.get('/about',(req,res)=> {
    res.render('about')
})

router.post('/forgotpassword',forgotController.forgot)

router.get('/resetpassword/:mnumber/:token',forgotController.reset)

router.post('/resetpassword/:mnumber/:token',forgotController.verifyreset)

module.exports = router;