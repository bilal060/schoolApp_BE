const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();
const { check } = require('express-validator');

router
  .route('/events')
  .get(eventController.getEvents)
  .post( [
    check('name')
      .not()
      .isEmpty(),
    check('date')
      .not()
      .isEmpty(),
    check('time.start')
      .not()
      .isEmpty(),
    check('time.end')
      .not()
      .isEmpty(),
  ],
eventController.CreateEvent);

router
  .route('/events/:id')
  .get(eventController.getEvent)
  .patch([
    check('name')
      .not()
      .isEmpty(),
    check('date')
      .not()
      .isEmpty(),
    check('time.start')
      .not()
      .isEmpty(),
    check('time.end')
      .not()
      .isEmpty(),
  ],eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;
