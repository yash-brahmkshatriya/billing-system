const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./api/config/database');
require('dotenv/config');

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

// MiddleWares
// app.use(cors({origin:'http://localhost:4200'}))
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// app.use('/',require('./api/routes/index'))
app.use('/api/user', require('./api/routes/user'));
app.use('/api/bill', require('./api/routes/bill'));

// Connecting to MongoDB Database
mongoose.connect(
  // config.DB_CONNECT,
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log('Not Connected to db');
    } else {
      console.log('Connected to db');
    }
  }
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log('Backend server listening at port ', port);
});
