
const express = require('express')
const studentController = require('../controllers/studentController');
const router = express.Router()


router
  .route('/students')
  .get(studentController.getStudennts)
  .post(studentController.CreateStudent);

router
  .route('/students/:id')
  .get(studentController.getStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);



module.exports =router;

