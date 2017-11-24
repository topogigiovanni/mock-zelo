'use strict'

module.exports = function(app){
	var giftCard = require('../controllers/giftCardController');
	var loyaltyCard = require('../controllers/loyaltyCardController');
	var transaction = require('../controllers/transactionController');

	var express = require('express'),
		basicAuth = require('express-basic-auth');


	var basicAuthMiddle = basicAuth({
    	users: { 'zeloapi-user': 'DCG123' },
    	unauthorizedResponse: getUnauthorizedResponse
	});

  	//giftcard routes
	app.get('/giftcard', basicAuthMiddle, giftCard.list);
	app.get('/giftcard/find', basicAuthMiddle,giftCard.find);
	app.post('/giftcard/create', basicAuthMiddle, giftCard.create);
	app.post('/giftcard/capture', basicAuthMiddle, giftCard.capture);
	app.post('/giftcard/balance', basicAuthMiddle, giftCard.balance);

	//loyaltycard routes
	app.get('/loyaltycard', basicAuthMiddle, loyaltyCard.list);
	app.post('/loyaltycard/create', basicAuthMiddle, loyaltyCard.create);
	app.get('/loyaltycard/find', basicAuthMiddle, loyaltyCard.find);
	app.post('/loyaltycard/balance', basicAuthMiddle, loyaltyCard.balance);
	app.post('/loyaltycard/capture', basicAuthMiddle, loyaltyCard.capture);
	app.post('/loyaltycard/statementHtml', basicAuthMiddle, loyaltyCard.statementHtml);


	//transaction routes
	app.route('/transaction')
		.get(transaction.list);

	app.route('/transaction/find')
		.get(transaction.find);
  
};

function getUnauthorizedResponse(request) {
    return request.auth ?
        ('Credenciais ' + request.auth.user + ':' + request.auth.password + ' inválidas') :
        'Preencha usuario e senha da api'
}

