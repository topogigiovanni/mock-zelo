var express = require('express'),
  app = express(),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose'),
  GiftCard = require('./api/models/giftCardModel'),
  LoyaltyCard = require('./api/models/loyaltyCardModel')
  bodyParser = require('body-parser'),
  expressValidator = require('express-validator');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zeloapi')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());

var routes = require('./api/routes/CardRoutes');
routes(app);

app.listen(port);

console.log('Zelo Mock API started on: ' + port);
