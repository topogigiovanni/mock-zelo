'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GiftCardSchema = new Schema({
  card_id: {
    type: String,
    required: 'Preencha o card_id'
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
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model('giftcard', GiftCardSchema);
