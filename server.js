//modules
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'please dont hack express omg!'

//cookie parser
app.use(cookieParser());


//session module
app.use(session({
    secret: "xpresssecretpleasedonthack",
    saveUninitialized: true,
    resave: true
}));
 
//static directory
app.use(express.static(path.join(__dirname,'public')));
console.log(path.join(__dirname,'public'));
app.use(express.static(path.join(__dirname,'assets')));
console.log(path.join(__dirname,'assets'));



//parse url encoded bodies
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//view engine setup
app.set('view engine', 'hbs');

app.use('/', require('./routes/path'));
app.use('/auth',require('./routes/auth'));
app.use('/transact',require('./routes/transact'));



//SERVER
var port = process.env.PORT || 2929;
app.listen(port, () => {
    console.log(`listening to ${port}`);
});

