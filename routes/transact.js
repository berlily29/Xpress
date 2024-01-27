const express =require('express');
const router = express.Router();
const sendController = require('../controllers/send');

router.post('/send', sendController.send);
router.post('/confirmation', sendController.confirmation);
router.post('/history',sendController.history);

router.post('/dashboard',sendController.dashboard);

router.get('/send',(req,res)=> {
    
    res.render("send");
})





module.exports=router;