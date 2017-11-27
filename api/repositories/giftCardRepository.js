var _ = require('lodash');
var mongoose = require('mongoose'),
	GiftCard = mongoose.model('giftcard');

module.exports = {
	GetAll: GetAll,
	Create: Create,
	Find: Find,
	Update: Update
};

function GetAll(callback) {
	callback = callback || function() {};
	GiftCard.find({}, function(err, giftcards) {
		if (err) {
			console.log('erro ao consultar cartões');
			console.log(err);

			return;
		}

		return callback(giftcards);
	});
}

function Find(cardId, email, callback) {
	callback = callback || function() {};
	GetAll(function(cards) {
		var card;
		if (!!cardId) {
			card = _.find(cards, function(c) {
				return c.card_id.toLowerCase() == cardId.toLowerCase()
			});
		} else {
			card = _.find(cards, function(c) {
				return c.email == email;
			});
		}
		return callback(card);
	});
}

function Create(card) {
	if (!card) {
		console.log('Cartão vazio');
		return;
	}

	var new_card = new GiftCard(card);
	new_card.save(function(err, card) {
		if (err) {
			console.log('erro ao criar cartão');
			console.log(err);

			return;
		}
	});
}

function Update(card) {
	if (!card) {
		console.log('Cartão vazio');
		return;
	}

	card = card.toObject();
	delete card._id;
	GiftCard.findOneAndUpdate({
		card_id: card.card_id
	}, {
		$set: card
	}, {
		new: true
	}, function(err, card) {
		if (err) {
			console.log('erro ao atualizar cartão - ' + err);
			console.log(err);
		}
	});
}
