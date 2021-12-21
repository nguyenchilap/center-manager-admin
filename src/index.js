const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

const route = require('./routes'); 
const db = require('./config/db');

// Authentication Packages
const session = require('express-session');
const passport = require('./config/passport');

//CONNECT TO DB
db.connect();

//HTTP logger
app.use(morgan('combined'));

//override with X-HTTP-Method-Override header in request
app.use(methodOverride('_method'))

//Add static folder
app.use(express.static(path.join(__dirname, 'public')));

//for parsing application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Express Session
app.use(session({
  secret: 'ansckansclahicqwunak',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

//Use Passport
app.use(passport.initialize());
app.use(passport.session());

//Template Engine
app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: require('./config/handlebars'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Route init

route(app);

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// })

app.listen(process.env.PORT || 3000);