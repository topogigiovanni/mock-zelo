var _ = require('lodash');
var mongoose = require('mongoose'),
	LoyaltyCard = mongoose.model('loyaltycard');

module.exports = {
	GetAll: GetAll,
	Create: Create,
	Find: Find,
	Update: Update
};

function GetAll(callback) {
	callback = callback || function() {};
	LoyaltyCard.find({}, function(err, loyaltycards) {
		if (err) {
			console.log('erro ao consultar cartões fidelidade');
			console.log(err);

			return;
		}

		return callback(loyaltycards);
	});
}

function Create(card) {
	if (!card) {
		console.log('Cartão vazio');
		return;
	}

	var new_card = new LoyaltyCard(card);
	new_card.save(function(err, card) {
		if (err) {
			console.log('erro ao criar cartão');
			console.log(err);

			return;
		}
	});
}

function Find(cardId, email = null, documentNumber = null, callback) {
	callback = callback || function() {};

	GetAll(function(cards) {
		if (!!cardId || cardId === 0) {
			card = _.find(cards, function(c) {
				return c.card_id.toLowerCase() == cardId.toLowerCase()
			});
		} else if (!!email) {
			card = _.find(cards, function(c) {
				return c.email == email
			});
		} else {
			card = _.find(cards, function(c) {
				return c.document_number == documentNumber;
			});
		}

		return callback(card);
	});
}

function Update(card) {
	if (!card) {
		console.log('Cartão vazio');
		return;
	}

	card = card.toObject();
	delete card._id;
	LoyaltyCard.findOneAndUpdate({
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
