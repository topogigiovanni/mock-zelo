var lodash = require('lodash');
var mongoose = require('mongoose'),
  Transaction = mongoose.model('transaction');

module.exports = {
  GetAll: GetAll,
  Create: Create,
  Find: Find
}

function GetAll(callback){
  callback = callback || function(){};
  Transaction.find({}, function(err, transactions){
    if(err){
      console.log('erro ao consultar transações');
      return new Error(err);
    }

    return callback(transactions);
  })
}

function Find(transactionId, callback){
  callback = callback || function(){};
  GetAll(function(transactions){
    var transaction = lodash.find(transactions, function(t) { return t._id == transactionId } );
    return callback(transaction);
  });
}

function Create(cardId, cardType, orderNumber, value, callback){
  try{
    callback = callback || function(){};
    var transaction = {
      "card_id": cardId,
      "card_type": cardType,
      "order_number": orderNumber,
      "captured_value": value,
      "created_date": Date.now()
    }

    var new_transaction = new Transaction(transaction);
    new_transaction.save(function(err, transaction){
      if(err){
        return new Error(err);
      }
      return callback(transaction._id);
    });
  }
  catch(err){
    return new Error("Não foi possível criar a transação.")
  }
}