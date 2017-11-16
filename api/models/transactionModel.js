'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TransactionSchema = new Schema({
  card_id: {
    type: String
  },
  captured_value: {
    type: String,
    default: 0
  },
  captured_date: {
    type: Date
  },
  card_type: {
    type: String
  },
  order_number: {
    type: String
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);