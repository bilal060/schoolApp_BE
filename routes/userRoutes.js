const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/adminAuthController');


const fileUpload  = require('../middlewares/profile-upload');

const router = express.Router();
router.post('/signup',authController.signup)
router.post('/verifyUser',authController.verifyOTP)
router.post('/login',authController.login)
router.post('/resetPassWithOTP',authController.forgotpassword)
router.post('/otpverify',authController.otpverify)
router.post('/reset',authController.resetPassword)
router.get('/getUsers',userController.getAllUsers)
router.post('/resendOTP',authController.resendOTP)
router.patch('/UpdateUserSetting/:id',fileUpload.single('image'),authController.UpdateUserSetting)
//Aditional Methods->
// router.use(authController.protect)
// router.patch('/updatePassword',authController.updatePassword)
// router.patch('/updateMe',userController.updateMe)
// router.delete('/deleteMe',userController.deleteMe)
// router.get('/getMe',userController.getMe,userController.getUser)
// router.use(authController.restrictTo('admin'))
module.exports = router;
