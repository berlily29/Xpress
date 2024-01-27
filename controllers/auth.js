
//modules
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/xchange');

const loginModel = require('../models/loginModel');
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
        console.log("MYSQLDB CONNECTED in Auth...");
    }
})


var OTP = '';


//Functions START HERE
function register (req,res) {


    const {number, fname, mname, lname, mpin, cmpin, address,mail} = req.body;

    db.query('SELECT Phone_Num FROM users WHERE Phone_Num = ?', [number], async (error,results) => {
        //let result = Object.values(JSON.parse(JSON.stringify(rows))); FOR RESERVE ISSUE

        if (error) {
            console.log(error);
        }
        
        if(results.length > 0) {


            return res.render('register', {
                message: "The mobile number is already used by another user"
            });
        }
        else if (mpin !== cmpin) {
            return res.render('register', {
                message: "MPIN doesn't match! Check and try again!"
            })
        }

        let hashedpin = await bcrypt.hash(mpin, 8);

        db.query('INSERT INTO users SET ?', {Phone_Num:number,First_Name:fname,Middle_Name:mname,Last_Name:lname,MPIN:hashedpin,Balance:'0',Address:address,Email:mail}, (error,results) => {
            if(error) {
                console.log(error);
            }
            else {
                return res.render('register', {
                    message: "Account created! You can now proceed to the Login"
                })
            }
        });

    });

}

function login(req,res) {

    const {number, mpin} = req.body;

    db.query('SELECT * from users WHERE Phone_Num = ?',[number], async (error,results) => {

       var rowdatapacket = Object.values(JSON.parse(JSON.stringify(results)));


      if (error){
        console.log(error);
      }

      if (results.length == 1) {
                var mpinstored = rowdatapacket[0].MPIN;
                var emailer = rowdatapacket[0].Email;
                req.session.email = rowdatapacket[0].Email;
                req.session.balance = parseFloat(rowdatapacket[0].Balance).toFixed(2);
                req.session.fname = rowdatapacket[0].First_Name;
                req.session.lname = rowdatapacket[0].Last_Name
                req.session.mnumber = rowdatapacket[0].Phone_Num;
                req.session.transactlog = await transactModel.find({Phone:number}).select({'_id':0}).sort({'Logs.Transact.Timestamp':-1});


                // OTP GENERATOR
                var digits = '0123456789'; 
                OTP = ''; 
                for (let i = 0; i < 4; i++ ) { 
                OTP += digits[Math.floor(Math.random() * 10)]; } 
                console.log(OTP);

                const hashedmpin = await bcrypt.compare(mpin, mpinstored);
                console.log(hashedmpin);

                if (hashedmpin) {
                    
                    //MAILER
                    let body = `NOTE: Do not share it to anyone! your OTP is ${OTP}`;
                    async function mailer () {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'luisegianyambao.asi@gmail.com',
                          pass: 'fccx exws uarm bzzg'
                        }
                      });

                      var mailOptions = {
                        from: 'xpress@gmail.com',
                        to: emailer,
                        subject: 'xpress OTP authentication',
                        text: body
                      };

                     const sending = await transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      }); 
                    
                    }
                    mailer()

                    res.render('otp');
                    
                } 
            
                else{
                    return res.render('login', {
                        message: "Incorrect MPIN! Please try again!"
                    })
                }
      }  
      else {
        return res.render('login', {
            message: "Cannot find your mobile number"
        })
      }

    })


}

 async function createLog(Phone) {
    const d = new Date();


    try {
     const user = await loginModel.create({
    Phone: Phone
    });

    }
    catch(e) {
        console.log(e)
    }
    
}

async function otp (req,res) {

    //INPUT GETTER
    const {one,two,three,four} = req.body;
    var input = one+two+three+four;
    console.log(input);

    if (input == OTP) {
       mphone = req.session.mnumber;
       createLog(mphone);

       var result = await loginModel.find({Phone:mphone}).select({'_id':0,'Logs':1}).limit(5).sort({'Logs.Login':-1});

       req.session.login = result

        res.render('dashboard', {
            email:req.session.email,
            balance:req.session.balance,
            fname:req.session.fname,
            lname:req.session.lname,
            logs:req.session.login,
            phone: req.session.mnumber
        });
        
    }
    else {
        res.render('otp', {
            message: "Invalid OTP! Try Again!"
        })
    }

}

function cancel(req,res) { 
    res.render('dashboard', { 
        email: req.session.email, 
        balance: req.session.balance, 
        fname: req.session.fname, 
        lname: req.session.lname, 
        logs:req.session.login,
        phone: req.session.mnumber
    })
}

function logout (req,res) {
    req.session.destroy();
    res.render('home');
}


module.exports = {register : register, login:login, otp:otp, logout:logout, cancel: cancel};