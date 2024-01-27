
const mysql = require('mysql');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/xchange');
const transactModel = require('../models/transactModel');

const db = mysql.createConnection({
    host: 'localhost',
    user :'root',
    password : '',
    database : 'xpress'
});

db.connect((error)=> {
    if(error) {
        console.log(error);
    }
    else {
        console.log("MYSQLDB CONNECTED in Trans...");
    }
})



function send (req,res) {
    const {rnumber,amount,message} = req.body;

    db.query('SELECT Phone_Num,Balance,First_Name,Last_Name from users WHERE Phone_Num = ?',[rnumber], async (error,results) => {

        var rowdatapacket = Object.values(JSON.parse(JSON.stringify(results)));

        if (results.length == 1) {
            var balance =parseFloat(req.session.balance).toFixed(2);
            var mnumber =req.session.mnumber
            var rfname = rowdatapacket[0].First_Name
            var rlname = rowdatapacket[0].Last_Name;
            var rmobile = rowdatapacket[0].Phone_Num;
            var rbalance = rowdatapacket[0].Balance;

            req.session.send = (balance - parseFloat(amount)).toFixed(2);
            req.session.receive = (rbalance + parseFloat(amount)).toFixed(2);
            req.session.rnumber = rmobile;
            req.session.message = message;
            req.session.amount = amount;


            var sfname = req.session.fname
            var slname = req.session.lname
            console.log(req.session.send);
            console.log(req.session.receive);
            
            
            
            if (req.session.send < 0) {
                res.render('send', {
                    message:"INSUFFICIENT BALANCE"
                })
            }
            else {

                res.render('confirm', {
                    rfname:rfname,
                    rlname:rlname,
                    rmobile:rmobile,
                    amount:amount,
                    balance:balance,
                    mnumber:mnumber, 
                    fname: sfname, 
                    lname: slname,
                    msg: req.session.message
                    
                
                });
                
            }
        }
        else {
            res.render('send', {
                message:"NUMBER DOES NOT EXIST!"
            })
        }

    }
    
    
    )
    
}

async function sendLog(mnumber,amount,message) {

    try {
        console.log(mnumber);        
    const user = await transactModel.create({
    Phone: mnumber,
    Logs:
        {Transact :
        {Details:
        {Amount: amount,
         Mode: "Sender",
         Message:message,
        }
    }
}
});

}

    catch(e) {
        console.log(e)
    }
    
}

async function receiveLog(rnumber,amount,message) {

    try {
        console.log(rnumber);
    const user = await transactModel.create(
        {Phone: rnumber,
     Logs: {Transact :{Details:
        {Amount: amount,
         Mode: "Receiver",
         Message:message,
        }

    }} });
}

    catch(e) {
        console.log(e)
    }
    
}


function confirmation (req,res) {
    var send =req.session.send 
    var receive= req.session.receive
    var sender =req.session.mnumber
    var recipient=req.session.rnumber
    var amount = req.session.amount
    var message = req.session.message

    db.query('UPDATE users SET Balance = ? WHERE Phone_Num = ?',[send,sender],(error,results)=>{
        if (error) {
            console.log(error);
        }
        else {
            db.query('UPDATE users SET Balance = ? WHERE Phone_Num = ?',[receive,recipient],async (error,results)=>{
                
                if (error) {
                    console.log(error);
                }
                else 
                {
                    
                    receiveLog(recipient,amount,message);
                    sendLog(sender,amount,message);
                    req.session.transactlog = await transactModel.find({Phone:sender}).select({'_id':0}).sort({'Logs.Transact.Timestamp':-1});
                    console.log(req.session.transactlog)
                    req.session.balance = send
                    res.render('dashboard',{
                        message:"SUCCESSFULLY SENT!",
                        email:req.session.email,
                        balance:req.session.balance,
                        fname:req.session.fname,
                        lname:req.session.lname,
                        logs:req.session.login,
                        phone: sender
                    })
                }
            })
        }
        
    })
}

function history(req,res) {
    res.render('transactHistory',{
        transactlog:req.session.transactlog
    })
}

function dashboard(req,res) {
    res.render('dashboard',{
        email:req.session.email,
        balance:req.session.balance,
        fname:req.session.fname,
        lname:req.session.lname,
        logs:req.session.login
    })
}

module.exports = {send:send,confirmation:confirmation,history:history,dashboard:dashboard};