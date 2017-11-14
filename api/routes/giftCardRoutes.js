'use strict'

module.exports = function(app){
	var giftCard = require('../controllers/giftCardController');

  //giftcard routes

	app.route('/giftcard')
		.get(giftCard.list);

	app.route('/giftcard/find')
		.get(giftCard.find);

	app.route('/giftcard/create')
		.post(giftCard.create);

	app.route('/giftcard/capture')
		.post(giftCard.capture);
  
};
