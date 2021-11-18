const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');

const app = express();
const port = 3000;

const route = require('./routes'); 
const db = require('./config/db');

//CONNECT TO DB
db.connect();

//HTTP logger
app.use(morgan('combined'));

//Add static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: true,
}));
//app.use(express.json);

//Template Engine
app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      isNone: param => param === 'none', 
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Route init

route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})