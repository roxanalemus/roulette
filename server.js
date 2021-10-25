// server.js

// set up ======================================================================
const express = require('express'); 
const app = express();
const port = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const configDB = require('./config/database.js');
let db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
    if (err) return console.log(err)
    db = database
    require('./app/routes.js')(app, passport, db); 
});

require('./config/passport')(passport);

// MIDDLEWARES:
app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); 


app.use(session({
    secret: 'rcbootcamp2021b',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
