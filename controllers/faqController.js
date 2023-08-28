
const FAQ = require("../models/faqModel");
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const { validationResult } = require('express-validator');

const CreateFAQ =catchAsync( async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(new AppError('Invalid data received', 422));
  }
    const newDoc = new FAQ({
    ...req.body
    });
  await  newDoc.save()
    return res.status(201).json({
      'FAQ': newDoc,
    });
  
});

const getFAQS = factory.getAll(FAQ)
const getFAQ =  factory.getOne(FAQ)
const updateFAQ = factory.updateOne(FAQ)
const deleteFAQ= factory.deleteOne(FAQ)




exports.CreateFAQ = CreateFAQ;
exports.getFAQS = getFAQS;
exports.getFAQ = getFAQ;
exports.updateFAQ = updateFAQ;
exports.deleteFAQ = deleteFAQ;
