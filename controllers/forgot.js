const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


const JWT_SECRET = 'PLEASE DONT HACK! THIS IS MY FINALS :((';


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
        console.log("MYSQLDB CONNECTED in Forgot...");
    }
})

function forgot(req,res) {
    const {email} = req.body

    db.query('SELECT * FROM users WHERE Email = ?',[email], (error,results) => {


        if (results.length == 1 ){

        var rowdatapacket = Object.values(JSON.parse(JSON.stringify(results)));
        var email = rowdatapacket[0].Email;
        var mpin = rowdatapacket[0].MPIN;
        var mnumber = rowdatapacket[0].Phone_Num;

        req.session.mpin = mpin;

        console.log(req.session.mpin)

        const secret = JWT_SECRET + mpin

        const payload = {
        }
        const token = jwt.sign(payload, secret, {expiresIn:'10m'});
        const link = `http://localhost:2929/resetpassword/${mnumber}/${token}`
        console.log(link);

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
                        to: email,
                        subject: 'xpress Change MPIN',
                        html: `<p>PLEASE RESET YOUR PASSWORD <a href='${link}'>HERE</a> </p> <br> <br> <small> note: This will expire soon! </small>`
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

                    res.render('forgot',{
                        message:"CHECK YOUR EMAIL."
                    })



        }

        else {
            res.render('forgot',{
                message:"Email doesn't match any of our records!"
            })
        }

    })
}

function reset(req,res) {

    const {mnumber, token} = req.params;

    db.query('SELECT * from users WHERE Phone_Num = ?',[mnumber], (error,results) => {
        

        if (results.length < 1) {
            res.send('INVALID SESSION...');
            return
        }
        else{

        var rowdatapacket = Object.values(JSON.parse(JSON.stringify(results)));


        var email = rowdatapacket[0].Email;
        var mpin = rowdatapacket[0].MPIN;
        console.log(mpin)

        const secret = JWT_SECRET + mpin

        try {
            const payload = jwt.verify(token,secret)
            res.render('resetpassword')
        }
        catch(e) {
            console.log(e)
        }
        }
    })

}

async function verifyreset(req,res) {
    const {mnumber,token} = req.params;
    const{mpin,cmpin} =req.body;

    if(mpin == cmpin) {

        let hashedpin = await bcrypt.hash(mpin, 8);

        try{

        db.query("UPDATE users SET MPIN = ? WHERE Phone_Num = ?",[hashedpin,mnumber],(error,results)=> {

            if (error) {
                console.log(error)
            }
            else {
            res.render("home", {
                message:"MPIN Successfully Changed!"
            });
            }
        })
        }
        catch(e) {
            console.log(e)
        }
        
    }
    else {
        res.render("resetpassword", {message:"MPIN not the SAME WITH CONFIRM MPIN"});
    }


}

module.exports = {forgot:forgot, reset:reset, verifyreset:verifyreset}