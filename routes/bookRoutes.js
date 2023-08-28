const express = require('express')
const bookController = require('../controllers/bookController');
const router = express.Router()
const  fileUpload  = require('../middlewares/book-upload');
const { check } = require('express-validator');

router
  .route('/Book')
  .get(bookController.getBooks)
  .post( fileUpload.single('image'),[
    check('name')
    .not()
    .isEmpty(),
  check('authors')
    .not()
    .isEmpty(),
  ],
bookController.AddBook);

router
  .route('/Book/:id')
  .get(bookController.getBook)
  .patch(fileUpload.single('image'),[
    check('name')
      .not()
      .isEmpty(),
    check('authors')
      .not()
      .isEmpty(),
  ],bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;



