'use strict'

var repository = require('../repositories/transactionRepository');

exports.list = function(request, response){
  try{
    repository.GetAll(function(transactions){
      response.json(transactions);
    });
  }
  catch(err){
    response.send(err);
  }
}

exports.find = function(request, response){
	try	{
		var transactionId = request.query.transactionId;

		repository.Find(transactionId, function(transaction){
  			if(transaction == null)
  				response.send("Transação não encontrada");

  			response.json(transaction);
		});
	}
	catch(err){
		response.status(500);
		response.send("Não foi possível encontrar o cartão");
	}
}

