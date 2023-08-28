const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const studentUser = require('./../models/studentUserModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
  exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  }); 
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.getMe = catchAsync(async(req,res,next)=>{
  req.params.id = req.user.id
  next()
})
exports.deleteMe = catchAsync(async (req, res, next) => {
 await User.findByIdAndUpdate(req.user.id,{active:false})

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
exports.getAllStudent_user =catchAsync( async (req, res, next) => {
  const getStudent_users = await studentUser.find();
  if (!getStudent_users) {
    return  next(new AppError('not found Student_user', 404));
  }
   res.status(200).json({
    Student_user: getStudent_users,
  });
});
exports.deleteUser = factory.deleteOne(User)
exports.updateUser = factory.updateOne(User)
exports.createUser = factory.createOne(User)
exports.getUser =  factory.getOne(User)
exports.getAllUsers = catchAsync(async (req,res)=>{
  const users = await  User.find()
  res.json({
  users:users
  })
})
