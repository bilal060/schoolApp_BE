const {promisify} = require('util')
const studenUser = require('../models/studentUserModel');
const studentUserImage = require('../models/studentUserImageModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const bcrypt = require('bcrypt')
const cookie = require('cookie')

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const Student_user = require('../models/studentUserModel');
dotenv.config({ path: './config.env' });
const signToken = id =>{
 return jwt.sign(
    {id}, 
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPRISE_IN}
    )
}
const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
   user.token = token
   await user.save()

  res.status(statusCode).json({
    userFetch:user
  });
};
exports.studentSignUp = catchAsync(async (req, res,next) => {
  const { name,
    email,
    password = "1234567",
    phone1,
    phone2,
    state,
    city,
    dob,
  } = req.body;
  const checkEmail = await studenUser.findOne({email})
  if(checkEmail){
    return next(new AppError('email already exist', 400))
  }
  const user = new studenUser({
    name,
    email,
    password,
    phone1,
    phone2,
    state,
    city,
    dob,
  });
  const ResetOtp = await user.createotp();
  await user.save();
  const message = `Please Vierify your Account with This OTP ${ResetOtp}.`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Verify Account otp (valid for 10 mint)',
      message
    })
    res.status(200).json({
      Student_user: user
    });
  } catch (err) {
    user.userValidotp = undefined;
    await user.save();
    return next(new AppError('somting wrong to send email ', 500))
  }
}
)
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body
  if (!(email, otp)) {
    return next(new AppError('please provide email and otp !', 400))
  }
  const user = await studenUser.findOne({email}).select('+password')

  if(!user.otp){
    return next(new AppError('No OTP Matched By this email', 401))
  }
  const checkOTP = await user.correctotp(otp, user.otp)
  if (!user || !checkOTP) {
    return next(new AppError('please check your email and OTP', 401))
  }
  if (user.otpExpireTime < Date.now()) {
    return next(new AppError('OTP is invalid and expire', 400))
  }
  user.verified = true;
  user.otp = undefined;
  user.otpExpireTime = undefined;
  await user.save();
  res.status(200).json({
    ValidUser:{
      email:user.email,
      verified:user.verified
    }
  })

})
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!(email, password)) {
    return next(new AppError('please provide email and password !', 400))
  }

  let user;
  user = await studenUser.findOne({ email }).select('+password +verified')
  if (!user) {
    return next(new AppError('Email Not Available in DB', 404))
  }

  let checkPassword;
  try {
    checkPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(new AppError('Invalid credentials', 500))
  }

  if (!checkPassword) {
    return next(new AppError('Invalid credentials', 401))
  }

  if (user.verified===false) {
    return next(new AppError('You are not verified Please verify again!', 401))
  }
  createSendToken(user, 200, res)
}
)
exports.forgotpassword = catchAsync(async (req,res,next)=>{
const user = await studenUser.findOne({email:req.body.email})
if(!user){
  return next(new AppError('No user have with this email', 404 )) 
}
const ResetOtp = await  user.createotp()
await user.save({validateBeforeSave:false});
const message = `forgot your password submit a PATCH request with your Password and confirmPassword
to ${ResetOtp}.\n If you did't forget your password , Please ignore this email`
try{
  await sendEmail({
    email:user.email,
    subject:'Your Password reset otp (valid for 10 mint)',
    message
  })
  res.status(200).json({
    message:'Reset Password OTP send on your mail box'
  });
}catch(err){
  user.createPasswordResetOtp = undefined;
  user.passwordResetExpires - undefined;
  await user.save({validateBeforeSave:false});
  return(new AppError('somting wrong to send email ',500))
}



})
exports.resendOTP = catchAsync(async (req,res,next)=>{
  const user = await studenUser.findOne({email:req.body.email})
  if(!user){
    return next(new AppError('No user have with this email', 404 )) 
  }
  const ResetOtp = await  user.createotp()
  await user.save({validateBeforeSave:false});
  const message = `forgot your password submit a PATCH request with your Password and confirmPassword
  to ${ResetOtp}.\n If you did't forget your password , Please ignore this email`
  try{
    await sendEmail({
      email:user.email,
      subject:'Your Password reset otp (valid for 10 mint)',
      message
    })
    res.status(200).json({
      message:'OTP send on your mail box'
    });
  }catch(err){
    user.createPasswordResetOtp = undefined;
    user.passwordResetExpires - undefined;
    await user.save({validateBeforeSave:false});
    return(new AppError('somting wrong to send email ',500))
  }
  
  
  
})
exports.otpverify = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body
  if (!(email, otp)) {
    return next(new AppError('please provide email and otp !', 400))
  }
  const user = await studenUser.findOne({email}).select('+password')

  if(!user.otp){
    return next(new AppError('No OTP Matched By this email', 401))
  }
  const checkOTP = await user.correctotp(otp, user.otp)
  if (!user || !checkOTP) {
    return next(new AppError('please check your email and OTP', 401))
  }
  if (user.otpExpireTime < Date.now()) {
    return next(new AppError('OTP is invalid and expire', 400))
  }
  user.verified = true;
  user.otp = undefined;
  user.otpExpireTime = undefined;
  await user.save();
  res.status(200).json({
      "verify": true
  })

})
exports.resetPassword =catchAsync( async (req,res,next)=>{
  const {newPass,email} = req.body
  if(!(email && newPass)){
    return next(new AppError('Values are null', 400))
}
const existingData = await studenUser.findOne({email})
if(!existingData){
  return next(new AppError('User not exist', 400))
}
if(!existingData.verified){
  return next(new AppError('User not verified', 400))
}
if(newPass.length<8){
  return next(new AppError('Pass to short', 400))
}

existingData.password = newPass
existingData.otp = undefined;
existingData.otpExpireTime = undefined;
await existingData.save()
   const  message ='Your Password Reset Done';
   res.json({message:message})

});

exports.resendOTP = catchAsync(async (req,res,next)=>{
  const user = await studenUser.findOne({email:req.body.email})
  if(!user){
    return next(new AppError('No user have with this email', 404 )) 
  }
  const ResetOtp = await  user.createotp()
  await user.save({validateBeforeSave:false});
  const message = `forgot your password submit a PATCH request with your Password and confirmPassword
  to ${ResetOtp}.\n If you did't forget your password , Please ignore this email`
  try{
    await sendEmail({
      email:user.email,
      subject:'Your Password reset otp (valid for 10 mint)',
      message
    })
    res.status(200).json({
      message:'OTP send on your mail box'
    });
  }catch(err){
    user.createPasswordResetOtp = undefined;
    user.passwordResetExpires - undefined;
    await user.save({validateBeforeSave:false});
    return(new AppError('somting wrong to send email ',500))
  }
  
  
  
  })


  exports.updateStudentUser =catchAsync( async (req, res, next) => {
    const userId = req.params.id;
    let findUser 
     findUser = await studenUser.findById(userId)
    if(!findUser){
      return(new AppError('user not found',404))
    }
    let { name, email, phone1, phone2, state, city, dob } = req.body;
    if(email === undefined){
      email=findUser.email
    }
    const updateFields = { name, email, phone1, phone2, state, city, dob };
    const studentUser = await studenUser.findById(userId);
    let newImage;
    let oldImage;
    if (req.file?.path) {
      oldImage = await studentUserImage.findOne({ user: studentUser._id });
      if (oldImage) {
        await studentUserImage.deleteOne({ _id: oldImage._id });
      }
      newImage = new StudentUserImg({
        user: studentUser._id,
        image: req.file?.path,
      });
      await newImage.save();
    } else {
      oldImage = await studentUserImage.findOne({ user: studentUser._id });
    }
    const user = await studenUser.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
    if (!user) {
      return  next(new AppError('user Not Available in DB', 400));
    }
    if (newImage) {
      res.status(200).json({
        userFetch: user,
        image: newImage,
      });
    } else {
      res.status(200).json({
        userFetch: user,
        image: oldImage,
      });
    }
});


exports.studentUploadImage =catchAsync( async (req, res,next) => {
  const imagepath = req.file?.path;
  const studentUser = await Student_user.findById(req.params.id);
  if(!studentUser){
    return  next(new AppError('user Not Available in DB', 404));
  }
  const newImage = new studentUserImage({
    user: studentUser._id,
    image: imagepath,
  });
  await newImage.save();
  res.status(200).json({
    message: "Image added to the database successfully.",
    studentUser,
    newImage,
  });
});




//Additional Methods
exports.updatePassword = catchAsync( async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
  }

)
exports.protect = catchAsync( async(req,res,next)=>{
  let token 
  if(req.headers.authorization && req.headers.authorization.startsWith('Beare')){
    token = req.headers.authorization.split(' ')[1]
  }
if(!token){
return next(new AppError('you are not logeed in! please login again', 401 )) 
} 
const decode = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
const currentUser = await User.findById(decode.id)
if(!currentUser){
  return next(new AppError('The user dose not exist in this token', 401 )) 
}
if(currentUser.changedPasswordAfter(decode.iat)){
  return next(new AppError('Password recently change so please login again for new TOKEN', 401 )) 
}

req.user = currentUser;
next()
})
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
  
      next();
    };
};