const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const perfAnalytics = require('./routes/perf-analytics');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 9000;

// Connect to the database
mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(bodyParser.json());

app.use('/api/v1/perf-analytics', perfAnalytics);

app.use('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
