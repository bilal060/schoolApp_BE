const Alert = require('../models/alertModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const CreateAlert = catchAsync(async (req, res, next) => {
  const alert = new Alert({
    ...req.body
  });
  const addAlert = await alert.save();
  res.status(201).json({
    savedAlert: addAlert
  });
});
const getAlerts = factory.getAll(Alert);
const getAlert = factory.getOne(Alert);
const updateAlert = factory.updateOne(Alert);
const deleteAlert = factory.deleteOne(Alert);
exports.CreateAlert = CreateAlert;
exports.getAlerts = getAlerts;
exports.getAlert = getAlert;
exports.updateAlert = updateAlert;
exports.deleteAlert = deleteAlert;
