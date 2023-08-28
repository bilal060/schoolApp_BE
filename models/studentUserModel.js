const mongoose= require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt')


const Student_userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone1: {
    type: String,
    required: true,

  },
  phone2: {
    type: String,
    required: true,

  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,

  },
  dob: {
    type: String,
    required: true,

  },
  password: {
    type: String,
    required: true,
    minLenght: 7,
    default:'11223344'
  },
  token :{
    type:String
  }
  ,
  verified :{
    type:Boolean,
    default:false
  },
  passwordChangedAt:Date,
  otp: String,
  otpExpireTime: Date,

});





Student_userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

Student_userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


 
Student_userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
Student_userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

Student_userSchema.methods.createotp = async function () {
  const otp = `${Math.floor(1000 + Math.random() * 900)}`
  const hashotp = await bcrypt.hash(otp, 12);
  this.otp = hashotp;
  this.otpExpireTime = Date.now() + 10 * 60 * 1000;
  return otp;
};
Student_userSchema.methods.correctotp = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
Student_userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};





const Student_user = mongoose.model('Student_user',Student_userSchema); 
module.exports = Student_user;