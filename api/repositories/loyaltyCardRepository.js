var lodash = require('lodash');
var mongoose = require('mongoose'),
  LoyaltyCard = mongoose.model('loyaltycard');

module.exports = {
  GetAll: GetAll,
  Create: Create,
  Find: Find,
  Update: Update
}

function GetAll(callback){
  callback = callback || function(){};
  LoyaltyCard.find({}, function(err, loyaltycards){
    if(err){
      console.log('erro ao consultar cartões fidelidade');
      return new Error(err);
    }

    return callback(loyaltycards);
  })
}

function Create(card){
  var new_card = new LoyaltyCard(card);
  new_card.save(function(err, card){
    if(err){
      console.log('erro ao criar cartão');
      return new Error(err);
    }
  });
}

function Find(cardId, email = null, documentNumber = null, callback){
  callback = callback || function(){};

  GetAll(function(cards){
    if(cardId != null)
      card = lodash.find(cards, function(c) { return c.card_id.toLowerCase() == cardId.toLowerCase()} );
    else if(email != null)
      card = lodash.find(cards, function(c) { return c.email == email } );
    else
      card = lodash.find(cards, function(c) { return c.document_number == documentNumber } );

    return callback(card);
  });
}

function Update(card){
  card = card.toObject();
  delete card._id;
  LoyaltyCard.findOneAndUpdate({ card_id: card.card_id}, {$set:card}, {new: true}, function(err, card){
    if(err){
      console.log('erro ao atualizar cartão - ' + err);
      return new Error(err);
    }
  });
}