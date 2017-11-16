'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LoyaltyCardSchema = new Schema({
  card_id: {
    type: String,
    required: 'Preencha o card_id'
  },
  document_number: {
    type: String
  },
  email: {
    type: String
  },
  balance: {
    type: String,
    default: 0
  },
  is_valid: {
    type: Boolean,
    default: true
  },
  message: {
    type: String
  }
});

module.exports = mongoose.model('loyaltycard', LoyaltyCardSchema);
