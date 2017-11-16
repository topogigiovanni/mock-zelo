'use strict'

var _ = require('lodash');
var repository = require('../repositories/giftCardRepository');
var transactionRepository = require('../repositories/transactionRepository');

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
		var orderNumber = request.body.order_number;
  		var cards = request.body.cards;

  		var arrayCards = new Array();
  		var retorno;
  		for(var i = 0; i < cards.length; i++){
  			var c = cards[i];
  			var cont = 0;
  			repository.Find(c.card_id, c.email, function(card){

  				if(retorno) return false;

      			if(card == null){
      				response.status(400);
      				response.send("Cartão " + c.card_id + "não encontrado");
      				retorno = true;
      			}

      			if(!card.is_valid){
      				response.status(400);
      				response.send("Cartão " + c.card_id + " inválido");
      				retorno = true;
      			}

      			card.is_valid = false;
      			repository.Update(card);
      			
      			//criar transaction referente a esta captura
      			transactionRepository.Create(card.card_id, "giftcard", orderNumber, 0, function(transactionId){
      				cont++;
      				var responseCard = {
	    				'transaction_id': transactionId,
	    				'card_id': card.card_id,
	    				'is_valid': card.is_valid,
	    				'balance': card.balance,
	    				'message': card.message
    				}

      				arrayCards.push(responseCard);
      				
      				if(cont == cards.length){
    					response.json(arrayCards);
					}
    			});
    		});    		
  		}
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível capturar. Erro: " + err);
	}
}

