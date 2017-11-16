'use strict'

module.exports = function(app){
	var giftCard = require('../controllers/giftCardController');
	var loyaltyCard = require('../controllers/loyaltyCardController');

  	//giftcard routes
	app.route('/giftcard')
		.get(giftCard.list);

	app.route('/giftcard/find')
		.get(giftCard.find);

	app.route('/giftcard/create')
		.post(giftCard.create);

	app.route('/giftcard/capture')
		.post(giftCard.capture);


	//loyaltycard routes
	app.route('/loyaltycard')
		.get(loyaltyCard.list);

	app.route('/loyaltycard/create')
		.post(loyaltyCard.create);

	app.route('/loyaltycard/find')
		.get(loyaltyCard.find);

	app.route('/loyaltycard/balance')
		.post(loyaltyCard.balance);

	app.route('/loyaltycard/capture')
		.post(loyaltyCard.capture);
  
};
