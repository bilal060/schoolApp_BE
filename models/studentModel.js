const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  emergencyContactNo: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    default: null,
    index: true
  }
});


studentSchema.pre('save', async function (next) {
  if (!this.studentId) {
    const lastStudent = await Student.findOne({}, {}, { sort: { studentId: -1 } }).exec();
    const lastStudentId = lastStudent ? parseInt(lastStudent.studentId, 10) : 0;
    const newStudentId = (lastStudentId + 1).toString().padStart(6, '0');
    this.studentId = newStudentId;
  }
  next();
});



const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
