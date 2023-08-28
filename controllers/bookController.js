const Book = require('../models/bookModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const { validationResult } = require('express-validator');

const AddBook = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Invalid data received', 422));
  }
  const path = req.file.path;
  const book = new Book({
    ...req.body,
    image: path
  });
  await book.save();
  res.status(200).json({
    messgae: 'Save Data',
    book
  });
});
const getBooks = factory.getAll(Book);
const getBook = factory.getOne(Book);
const updateBook = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Invalid data received', 422));
  }
  const { name, authors } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  book.name = name;
  book.authors = authors;
  if (req.file) {
    book.image = req.file.path;
  }
  await book.save();
  res.status(200).json({
    message: 'Book updated successfully',
    book
  });
});
const deleteBook = factory.deleteOne(Book);

exports.AddBook = AddBook;
exports.getBooks = getBooks;
exports.getBook = getBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
