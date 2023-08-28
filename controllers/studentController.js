const Student = require("../models/studentModel");
const { v4: uuidv4 } = require('uuid');
const { json } = require("body-parser");
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')





const CreateStudent =catchAsync( async (req, res ,next) => {
    let { fullName, grade, contactNo, emergencyContactNo, address ,} =
    req.body;
  const Poststudent = new Student({
    fullName,
    grade,
    contactNo,
    emergencyContactNo,
    address,
  });
  await Poststudent.save()
  if (!Poststudent) {
    return  next(new AppError('somting Wrong', 400));
  }
  return res.status(201).json({
    Student: Poststudent,
  });

});
const getStudennts =catchAsync( async (req, res ,next) => {
    const students = await Student.find();
    res.status(200).json({
      students
    })
})
const getStudent =catchAsync( async (req, res ,next)  => {
  const studentId = req.params.id;
    const student = await Student.findOne({ studentId });
    if (!student) {
      return  next(new AppError('Student not found', 400));
    }
    res.json({ Student:student});
})
const updateStudent =catchAsync( async (req, res ,next) => {
  const studentId = req.params.id;
  const updateData = req.body;
    const student = await Student.findOneAndUpdate({ studentId }, updateData, {
      new: true
    });
    if (!student) {
      return  next(new AppError('Student not found', 400));
    }
    res.json({ Student:student});
})
const deleteStudent =catchAsync( async (req, res,next) => {
  const studentId = req.params.id;
    const student = await Student.findOneAndDelete({ studentId });
    if (!student) {
      return  next(new AppError('Student not found', 400));
    }
    res.json({ message: "Student deleted successfully" });
})
exports.CreateStudent = CreateStudent;
exports.getStudennts = getStudennts;
exports.getStudent = getStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;
