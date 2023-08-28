const express = require('express');
const userController = require('../controllers/userController');
const studentAuthController = require('../controllers/studentAuthController');

const fileUpload  = require('../middlewares/student-upload');

const router = express.Router();
router.post('/studentSignUp',studentAuthController.studentSignUp)
router.post('/verifyStudetUser',studentAuthController.verifyOTP)
router.post('/studentLogin',studentAuthController.login)
router.post('/resetStudentPassWithOTP',studentAuthController.forgotpassword)
// router.post('/otpverify',studentAuthController.otpverify)
router.post('/resetStudentPass',studentAuthController.resetPassword)
router.get('/getAllLoginStudent',userController.getAllStudent_user)
router.post('/resendStudentOTP',studentAuthController.resendOTP)
router.patch('/UpdateStudentUser/:id',fileUpload.single('image'),studentAuthController.updateStudentUser)
router.post('/students/:id/image',fileUpload.single('image'),studentAuthController.studentUploadImage)



//Aditional Routes->
// router.use(studentstudentAuthController.protect)
// router.patch('/updatePassword',studentstudentAuthController.updatePassword)
// router.patch('/updateMe',userController.updateMe)
// router.delete('/deleteMe',userController.deleteMe)
// router.get('/getMe',userController.getMe,userController.getUser)
// router.use(studentstudentAuthController.restrictTo('admin'))
module.exports = router;
