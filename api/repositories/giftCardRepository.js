var lodash = require('lodash');
var mongoose = require('mongoose'),
  GiftCard = mongoose.model('giftcard');

module.exports = {
  GetAll: GetAll,
  Create: Create,
  Find: Find,
  Update: Update
}

function GetAll(callback){
  callback = callback || function(){};
  GiftCard.find({}, function(err, giftcards){
    if(err){
      console.log('erro ao consultar cartões');
      return new Error(err);
    }

    return callback(giftcards);
  })
}

function Find(cardId, email, callback){
  callback = callback || function(){};
  GetAll(function(cards){
    var card;
    if(cardId != null)
      card = lodash.find(cards, function(c) { return c.card_id.toLowerCase() == cardId.toLowerCase()} );
    else
      card = lodash.find(cards, function(c) { return c.email == email } );
    
    return callback(card);
  });
}

function Create(card){
  var new_card = new GiftCard(card);
  new_card.save(function(err, card){
    if(err){
      console.log('erro ao criar cartão');
      return new Error(err);
    }
  });
}

function Update(card){
  card = card.toObject();
  delete card._id;
  GiftCard.findOneAndUpdate({ card_id: card.card_id}, {$set:card}, {new: true}, function(err, card){
    if(err){
      console.log('erro ao atualizar cartão - ' + err);
      return new Error(err);
    }
  });
}
