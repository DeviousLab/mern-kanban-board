const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to MERN Kanban Board' })
  });
}

app.use('/api/v1', require('./src/v1/routes'));


module.exports = app;
