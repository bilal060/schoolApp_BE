const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const moment = require('moment')


const alertSchema = new mongoose.Schema({
  Alert: {
    type: String,
    required: [true , 'please enter Alert'],
  },
  Location: {
    type: String,
    required: [true , 'please enter Location'],
  },
  createDate: {
    type: String,
    default: moment().format('YYYY-MM-DD')
  },
  createTime: {
    type: String,
    default: moment().format('HH:mm')
  },
  AlertReason: {
    type: String,
    required: [true , 'please enter AlertReason'],
  },
  AlertPrority: {
    type: String,
    required: [true , 'please enter AlertPrority'],
  },
});

  
  const Alert = mongoose.model("Alert", alertSchema);
  module.exports = Alert;