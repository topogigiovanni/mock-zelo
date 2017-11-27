'use strict'

var _ = require('lodash');
var repository = require('../repositories/loyaltyCardRepository');
var transactionRepository = require('../repositories/transactionRepository');

exports.list = function(request, response){
  try{
    repository.GetAll(function(cards){
      response.json(cards);
    });
  }
  catch(err){
  	response.status(500);
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
		request.assert('cardId', 'Preencha o cardId na querystring').notEmpty();
		var errors = request.validationErrors();

		if(errors){
			response.status(400);
      		response.send(errors);
      		return;
		}
		else{
			var cardId = request.query.cardId;

			repository.Find(cardId, "", "", function(card){
      			if(card == null){
      				response.status(400);
      				response.send("Cartão não encontrado");
      			}

      			response.json(card);
    		});
      	}
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível encontrar o cartão");
	}
}

exports.balance = function(request, response){
	try	{
		console.log("chegou aqui");

		console.log(request.body);
		var cardId = request.body.card_id;
  		var documentNumber = request.body.document_number;
  		var email = request.body.email;

		repository.Find(cardId, email, documentNumber, function(card){
  			if(card == null){
  				response.status(400);
  				response.send("Cartão não encontrado");
  			}

  			card.balance = card.balance.toLocaleString('pt-BR');

  			response.json(card);
		});
      	
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível encontrar o cartão");
	}
}

exports.capture = function(request, response){
	try{
		var orderNumber = request.body.ordernumber;
  		var card = request.body.card;
  		var value = request.body.value;

  		repository.Find(card.card_id, card.email, card.document_number, function(c){
      			if(c == null){
      				response.status(400);
      				response.send("Cartão não encontrado");
      			}
      			else if(!c.is_valid){
      				response.status(400);
      				response.send("Cartão inválido");
      			}
      			else if(c.balance < value){
      				response.status(400);
      				response.send("Saldo insuficiente. Saldo Atual: " + c.balance);
      			}
      			else{
      				c.balance = c.balance - value;
      				repository.Update(c);

      				transactionRepository.Create(card.card_id, "loyaltycard", orderNumber, c.balance, function(transactionId){
	      				var responseCard = {
		    				'transaction_id': transactionId,
		    				'card_id': c.card_id,
		    				'document_number': c.document_number,
		    				'email': c.email,
		    				'is_valid': c.is_valid,
		    				'balance': c.balance,
		    				'message': c.message
	    				}
						response.json(responseCard);
    				});
      			}
    		});
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível capturar");
	}
}

exports.statementHtml = function(request, response){
	try{
		var cardId = request.body.card_id;
  		var documentNumber = request.body.document_number;
  		var email = request.body.email;

  		repository.Find(cardId, email, documentNumber, function(card){
  			if(card == null){
  				response.status(400);
  				response.send("Cartão não encontrado");
  			}else{
  				GetHtml(card, function(html){
  				var cardResponse = {
	  				"card": {
	  					"card_id": card.card_id,
	  					"document_number": card.document_number,
	  					"email": card.email,
	  					"is_valid": card.is_valid,
	  					"message": card.message
	  				},
	  				"html": html
	  			}	

  				response.json(cardResponse);
  			});
  			}
  			
		});
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível retornar o html");
	}
}


function GetHtml(card, callback){
	console.log("GetHtml")
	callback = callback || function(){};
	var html = "";
	html += "<html><body><h2>Saldo atual: " + card.balance;
	html += " </h2><table><thead><tr><th>Transaction Id</th><th>Data</th><th>Valor</th></tr></thead><tbody>";
	console.log("Card: "+card);
	transactionRepository.GetAllByCard(card.card_id, function(transactions){
		console.log("Transactions: " + transactions);
		if(transactions != null){
			for (var i = 0; i < transactions.length; i++) {
				var transaction = transactions[i];

				var date = new Date(transaction.captured_date).toLocaleString("pt-BR");

				var htmlTransaction = "<tr>";
				htmlTransaction += "<td>"+transaction._id+"</td>";
				htmlTransaction += "<td>"+date+"</td>";
				htmlTransaction += "<td>"+transaction.captured_value+"</td>";
				htmlTransaction += "</tr>";

				html += htmlTransaction;
			}
		}
		

		html += "</tbody></table></body></html>";
		return callback(html);
	});

	
}