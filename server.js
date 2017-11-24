var express = require('express'),
  app = express(),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose'),
  GiftCard = require('./api/models/giftCardModel'),
  LoyaltyCard = require('./api/models/loyaltyCardModel'),
  Transaction = require('./api/models/transactionModel')
  bodyParser = require('body-parser'),
  expressValidator = require('express-validator'),
  basicAuth = require('express-basic-auth');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://jbarcela:Jonathan!1@ds111336.mlab.com:11336/heroku_c1t9lvvm')
//mongoose.connect('mongodb://localhost/zeloapi')

app.use(express.static(__dirname + '/public'));

app.use(basicAuth({
    users: { 'zeloapi-user': 'DCG123' },
    unauthorizedResponse: getUnauthorizedResponse
}))

app.get('/', function(request, response) {
  response.render('public/index');
});

app.get('/docs', function(request, response) {
  response.sendFile(__dirname + '/public/documentacao.html');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());

var routes = require('./api/routes/CardRoutes');
routes(app);

app.listen(port);

console.log('Zelo Mock API started on: ' + port);

function getUnauthorizedResponse(request) {
    return request.auth ?
        ('Credenciais ' + request.auth.user + ':' + request.auth.password + ' inválidas') :
        'Preencha usuario e senha da api'
}
