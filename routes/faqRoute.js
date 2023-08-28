const express = require('express')
const faqController = require('../controllers/faqController');
const router = express.Router()
const { check } = require('express-validator');


router
  .route('/faqs')
  .get(faqController.getFAQS)
  .post( [
    check('question')
      .not()
      .isEmpty(),
      check('answer')
      .not()
      .isEmpty(),
  ],
faqController.CreateFAQ);

router
  .route('/faqs/:id')
  .get(faqController.getFAQ)
  .patch([
    check('question')
      .not()
      .isEmpty(),
      check('answer')
      .not()
      .isEmpty(),
  ],faqController.updateFAQ)
  .delete(faqController.deleteFAQ);



module.exports =router;