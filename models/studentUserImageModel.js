
const mongoose= require("mongoose");
const StudentUserImageScheema = new mongoose.Schema({
  user: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'studentUser',
    required: true
  },
  image:{
    type:String
  }

});
const StudentUserImage = mongoose.model('StudentUserImage', StudentUserImageScheema);
module.exports = StudentUserImage;
