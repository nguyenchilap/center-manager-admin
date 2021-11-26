const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 3000;

const route = require('./routes'); 
const db = require('./config/db');

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
// for parsing application/json
// app.use(bodyParser.json());
// for parsing multipart/form-data
// const upload = multer();
// app.use(upload.array());

//Template Engine
app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      isNone: param => param === 'none', 
      dateTimeModifier: date => date.toLocaleString()
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Route init

route(app);

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// })

app.listen(process.env.PORT || 3000);