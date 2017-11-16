'use strict'

var _ = require('lodash');
var repository = require('../repositories/giftCardRepository');

exports.list = function(request, response){
  try{
    repository.GetAll(function(cards){
      response.json(cards);
    });
  }
  catch(err){
    response.send(err);
  }
}

exports.create = function(request, response){
	try{
		request.checkBody("card_id", "Preencha o card_id").notEmpty();
		request.checkBody("balance", "Preencha o balance").notEmpty();

		var errors = request.validationErrors();

		if(errors){
			response.status(400);
      		response.send(errors);
      		return;
		}
		else{
			var cardToCreate = request.body;
			repository.Create(cardToCreate);
			response.send('Cartão criado');
		}
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível criar o cartão");
	}
}

exports.find = function(request, response){
	try	{
		request.assert('cardId', 'Preencha o cardId na queryString').notEmpty();
		var errors = request.validationErrors();

		if(errors){
			response.status(400);
      		response.send(errors);
      		return;
		}
		else{
			var cardId = request.query.cardId;

			repository.Find(cardId, "", function(card){
      			if(card == null)
      				response.send("Cartão não encontrado");

      			response.json(card);
    		});
      	}
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível encontrar o cartão");
	}
}

exports.capture = function(request, response){
	try{
		var orderNumber = request.body.ordernumber;
  		var cards = request.body.cards;

  		var arrayCards = new Array();
  		_.forEach(cards, function (c){
    		repository.Find(c.card_id, c.email, function(card){
      			if(card == null)
      				response.send("Cartão " + c.card_id + "não encontrado");

      			if(!card.is_valid){
      				response.send("Cartão " + c.card_id + " inválido");
      			}

      			card.is_valid = false;
      			repository.Update(card);
      			arrayCards.push(card);
    		});
  		});
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível capturar");
	}
}
